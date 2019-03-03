/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const SKILL_NAME = 'polarcast';
const HELP_MESSAGE = 'You can ask me about everything polar related, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const ERROR_MESSAGE = 'Sorry, Polarcast is a bit tired. Ask again, please.'
const STOP_MESSAGE = 'Goodbye!';
const SUNRISE_SUNSET_API_URL = 'https://api.sunrise-sunset.org';
const LOCATIONIQ_API_URL = 'https://eu1.locationiq.com';
const LOCATIONIQ_API_KEY = '4fd5318b2415e7';

const HelloIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
      || (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'HelloIntent');
  },
  async handle(handlerInput) {
    let outputSpeech = 'Hello from the cold cold Polarcast! You can ask me anything polar-related.';

    return handlerInput.responseBuilder
      .withStandardCard(SKILL_NAME, outputSpeech)
      .speak(outputSpeech)
      .getResponse();

  },
};

const SunriseIntentHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SunriseIntent');
  },
  async handle(handlerInput) {
    const locationSlotValue = handlerInput.requestEnvelope.request.intent.slots.location.value;
    let outputSpeech = 'This is the default message.';

    await getRemoteData(`${LOCATIONIQ_API_URL}/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${locationSlotValue}&format=json`)
      .then(response => {
        const data = JSON.parse(response);
        const lng = data[0]['lon'];
        const lat = data[0]['lat'];
        
        return getRemoteData(`${SUNRISE_SUNSET_API_URL}/json?lat=${lat}&lng=${lng}&date=2019-03-02`);
      })
      .then(response => {
        const data = JSON.parse(response)['results']['sunrise'].split(' ');
        
        let sunriseTime = data[0].split(':').slice(0, 2).join(':')
        let middayValue = data[1]
        
        outputSpeech = `The sunrise time in ${locationSlotValue} is ${sunriseTime} ${middayValue}`;
      })
      .catch((err) => {
        //set an optional error message here
        outputSpeech = err.message;
        //outputSpeech = ERROR_MESSAGE;
      });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();
  },
};



/* BUILT IN INTENT HANDLERS */
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can introduce yourself by telling me your name';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const getRemoteData = function (url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? require('https') : require('http');
    const request = client.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed with status code: ' + response.statusCode));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err))
  })
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    HelloIntentHandler,
    SunriseIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

