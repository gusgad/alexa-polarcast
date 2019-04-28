/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const dayjs = require('dayjs');

const SKILL_NAME = 'polarcast';
const HELP_MESSAGE = 'You can ask me about everything polar related, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const ERROR_MESSAGE = 'Sorry, Polarcast is a bit tired. Ask again, please.'
const STOP_MESSAGE = 'Goodbye!';
const SUNRISE_SUNSET_API_URL = 'https://api.sunrise-sunset.org';
const LOCATIONIQ_API_URL = 'https://eu1.locationiq.com';
const LOCATIONIQ_API_KEY = '4fd5318b2415e7';
const DARKSKY_API_URL = 'https://api.darksky.net';
const DARKSKY_API_KEY = '6cf9dc388e2332cc037741897ab652f5';


/****************************
 * CUSTOM INTENT HANDLERS *
*****************************/
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


/* SUNSRISE TIME IN CITY TODAY */
const SunriseIntentHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SunriseIntent');
  },
  async handle(handlerInput) {
    const locationSlotValue = handlerInput.requestEnvelope.request.intent.slots.location.value;
    let outputSpeech = 'This is the default message.';
    const todaysDate = dayjs().format('YYYY-MM-DD');

    if (!locationSlotValue) {
      return handlerInput.responseBuilder
        .speak('Sorry, you need to specify the country or city in your request.')
        .getResponse();
    } else {
      await getRemoteData(`${LOCATIONIQ_API_URL}/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${locationSlotValue}&format=json`)
        .then(response => {
          const data = JSON.parse(response);
          const lng = data[0]['lon'];
          const lat = data[0]['lat'];

          return getRemoteData(`${SUNRISE_SUNSET_API_URL}/json?lat=${lat}&lng=${lng}&date=${todaysDate}`);
        })
        .then(response => {
          const data = JSON.parse(response);

          if (data['alerts']) {
            outputSpeech = handleWeatherAlert(data['alerts']);
            return false;
          }

          let sunriseTime = data['results']['sunrise'].split(' ')[0].split(':').slice(0, 2).join(':');
          let middayValue = data['results']['sunrise'].split(' ')[1];

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
    }
  }
};


/* SUNSET TIME IN CITY TODAY */
const SunsetIntentHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SunsetIntent');
  },
  async handle(handlerInput) {
    const locationSlotValue = handlerInput.requestEnvelope.request.intent.slots.location.value;
    let outputSpeech = 'This is the default message.';
    const todaysDate = dayjs().format('YYYY-MM-DD');

    if (!locationSlotValue) {
      return handlerInput.responseBuilder
        .speak('Sorry, you need to specify the country or city in your request.')
        .getResponse();
    } else {
      await getRemoteData(`${LOCATIONIQ_API_URL}/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${locationSlotValue}&format=json`)
        .then(response => {
          const data = JSON.parse(response);
          const lng = data[0]['lon'];
          const lat = data[0]['lat'];

          return getRemoteData(`${SUNRISE_SUNSET_API_URL}/json?lat=${lat}&lng=${lng}&date=${todaysDate}`);
        })
        .then(response => {
          const data = JSON.parse(response);

          if (data['alerts']) {
            outputSpeech = handleWeatherAlert(data['alerts']);
            return false;
          }

          const sunsetTime = data['results']['sunset'].split(' ')[0].split(':').slice(0, 2).join(':');
          const middayValue = data['results']['sunset'].split(' ')[1];

          outputSpeech = `The sunset time in ${locationSlotValue} is ${sunsetTime} ${middayValue}`;
        })
        .catch((err) => {
          //set an optional error message here
          outputSpeech = err.message;
          //outputSpeech = ERROR_MESSAGE;
        });

      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .getResponse();
    }
  }
};


/* DAY LENGTH IN CITY TODAY */
const DayLengthIntentHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'DayLengthIntent');
  },
  async handle(handlerInput) {
    const locationSlotValue = handlerInput.requestEnvelope.request.intent.slots.location.value;
    let outputSpeech = 'This is the default message.';
    const todaysDate = dayjs().format('YYYY-MM-DD');

    if (!locationSlotValue) {
      return handlerInput.responseBuilder
        .speak('Sorry, you need to specify the country or city in your request.')
        .getResponse();
    } else {
      await getRemoteData(`${LOCATIONIQ_API_URL}/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${locationSlotValue}&format=json`)
        .then(response => {
          const data = JSON.parse(response);
          const lng = data[0]['lon'];
          const lat = data[0]['lat'];

          return getRemoteData(`${SUNRISE_SUNSET_API_URL}/json?lat=${lat}&lng=${lng}&date=${todaysDate}`);
        })
        .then(response => {
          const data = JSON.parse(response);

          if (data['alerts']) {
            outputSpeech = handleWeatherAlert(data['alerts']);
            return false;
          }

          const dayLength = data['results']['day_length'].split(':');

          const dayLengthHour = dayLength[0].replace(/\b0+/g, '');
          const dayLengthMinute = dayLength[1].replace(/\b0+/g, '');
          const dayLengthSecond = dayLength[2].replace(/\b0+/g, '');

          outputSpeech = `The day length in ${locationSlotValue} is ${dayLengthHour} ${dayLengthHour === '1' ? 'hour' : 'hours'} ${dayLengthMinute} ${dayLengthMinute === '1' ? 'minute' : 'minutes'} and ${dayLengthSecond} ${dayLengthSecond === '1' ? 'second' : 'seconds'}.`;
        })
        .catch((err) => {
          //set an optional error message here
          outputSpeech = err.message;
          //outputSpeech = ERROR_MESSAGE;
        });

      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .getResponse();
    }
  }
};


/* SOLAR NOON TODAY */
const SolarNoonIntentHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'SolarNoonIntent');
  },
  async handle(handlerInput) {
    const locationSlotValue = handlerInput.requestEnvelope.request.intent.slots.location.value;
    let outputSpeech = 'This is the default message.';
    const todaysDate = dayjs().format('YYYY-MM-DD');

    if (!locationSlotValue) {
      return handlerInput.responseBuilder
        .speak('Sorry, you need to specify the country or city in your request.')
        .getResponse();
    } else {
      await getRemoteData(`${LOCATIONIQ_API_URL}/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${locationSlotValue}&format=json`)
        .then(response => {
          const data = JSON.parse(response);
          const lng = data[0]['lon'];
          const lat = data[0]['lat'];

          return getRemoteData(`${SUNRISE_SUNSET_API_URL}/json?lat=${lat}&lng=${lng}&date=${todaysDate}`);
        })
        .then(response => {
          const data = JSON.parse(response);

          if (data['alerts']) {
            outputSpeech = handleWeatherAlert(data['alerts']);
            return false;
          }

          const solarNoonTime = data['results']['solar_noon'].split(' ')[0].split(':').slice(0, 2).join(':');
          const middayValue = data['results']['solar_noon'].split(' ')[1];

          outputSpeech = `The solar noon in ${locationSlotValue} is at ${solarNoonTime} ${middayValue}.`;
        })
        .catch((err) => {
          //set an optional error message here
          outputSpeech = err.message;
          //outputSpeech = ERROR_MESSAGE;
        });

      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .getResponse();
    }
  }
};


/* TWILIGHT TIME TODAY */
const TwilightIntentHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TwilightIntent');
  },
  async handle(handlerInput) {
    const locationSlotValue = handlerInput.requestEnvelope.request.intent.slots.location.value;
    let outputSpeech = 'This is the default message.';
    const todaysDate = dayjs().format('YYYY-MM-DD');

    if (!locationSlotValue) {
      return handlerInput.responseBuilder
        .speak('Sorry, you need to specify the country or city in your request.')
        .getResponse();
    } else {
      await getRemoteData(`${LOCATIONIQ_API_URL}/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${locationSlotValue}&format=json`)
        .then(response => {
          const data = JSON.parse(response);
          const lng = data[0]['lon'];
          const lat = data[0]['lat'];

          return getRemoteData(`${SUNRISE_SUNSET_API_URL}/json?lat=${lat}&lng=${lng}&date=${todaysDate}`);
        })
        .then(response => {
          const data = JSON.parse(response);

          if (data['alerts']) {
            outputSpeech = handleWeatherAlert(data['alerts']);
            return false;
          }

          const twilightTime = data['results']['astronomical_twilight_end'].split(' ')[0].split(':').slice(0, 2).join(':');
          const middayValue = data['results']['astronomical_twilight_end'].split(' ')[1];

          outputSpeech = `The astronomical twilight time in ${locationSlotValue} is at ${twilightTime} ${middayValue}.`;
        })
        .catch((err) => {
          //set an optional error message here
          outputSpeech = err.message;
          //outputSpeech = ERROR_MESSAGE;
        });

      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .getResponse();
    }
  }
};


/* OZONE DENSITY TODAY */
const OzoneDensityIntentHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'OzoneDensityIntent');
  },
  async handle(handlerInput) {
    const locationSlotValue = handlerInput.requestEnvelope.request.intent.slots.location.value;
    let outputSpeech = 'This is the default message.';

    if (!locationSlotValue) {
      return handlerInput.responseBuilder
        .speak('Sorry, you need to specify the country or city in your request.')
        .getResponse();
    } else {
      await getRemoteData(`${LOCATIONIQ_API_URL}/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${locationSlotValue}&format=json`)
        .then(response => {
          const data = JSON.parse(response);
          const lng = data[0]['lon'];
          const lat = data[0]['lat'];

          return getRemoteData(`${DARKSKY_API_URL}/forecast/${DARKSKY_API_KEY}/${lat},${lng}?exclude=minutely,hourly,daily,flags?units=si`);
        })
        .then(response => {
          const data = JSON.parse(response);

          if (data['alerts']) {
            outputSpeech = handleWeatherAlert(data['alerts']);
            return false;
          }

          const ozoneValue = data['currently']['ozone'];

          outputSpeech = `The columnar density of total atmospheric ozone in ${locationSlotValue} is ${ozoneValue} Dobson units.`;
        })
        .catch((err) => {
          //set an optional error message here
          outputSpeech = err.message;
          //outputSpeech = ERROR_MESSAGE;
        });

      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .getResponse();
    }
  }
};


/* TEMPERATURE TODAY */
const TemperatureIntentHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TemperatureIntent');
  },
  async handle(handlerInput) {
    const locationSlotValue = handlerInput.requestEnvelope.request.intent.slots.location.value;
    let outputSpeech = 'This is the default message.';

    if (!locationSlotValue) {
      return handlerInput.responseBuilder
        .speak('Sorry, you need to specify the country or city in your request.')
        .getResponse();
    } else {
      await getRemoteData(`${LOCATIONIQ_API_URL}/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${locationSlotValue}&format=json`)
        .then(response => {
          const data = JSON.parse(response);
          const lng = data[0]['lon'];
          const lat = data[0]['lat'];

          return getRemoteData(`${DARKSKY_API_URL}/forecast/${DARKSKY_API_KEY}/${lat},${lng}?exclude=minutely,hourly,flags&units=auto`);
        })
        .then(response => {
          const data = JSON.parse(response);

          if (data['alerts']) {
            outputSpeech = handleWeatherAlert(data['alerts']);
            return false;
          }

          const temperatureValue = String(data['currently']['temperature']).split('.')[0];

          outputSpeech = `The air temperature currently in ${locationSlotValue} is ${temperatureValue} degrees.`;
        })
        .catch((err) => {
          //set an optional error message here
          outputSpeech = err.message;
          //outputSpeech = ERROR_MESSAGE;
        });

      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .getResponse();
    }
  }
};


/* VISIBILITY TODAY */
const VisibilityIntentHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'VisibilityIntent');
  },
  async handle(handlerInput) {
    const locationSlotValue = handlerInput.requestEnvelope.request.intent.slots.location.value;
    let outputSpeech = 'This is the default message.';

    if (!locationSlotValue) {
      return handlerInput.responseBuilder
        .speak('Sorry, you need to specify the country or city in your request.')
        .getResponse();
    } else {
      await getRemoteData(`${LOCATIONIQ_API_URL}/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${locationSlotValue}&format=json`)
        .then(response => {
          const data = JSON.parse(response);
          const lng = data[0]['lon'];
          const lat = data[0]['lat'];

          return getRemoteData(`${DARKSKY_API_URL}/forecast/${DARKSKY_API_KEY}/${lat},${lng}?exclude=minutely,hourly&units=auto`);
        })
        .then(response => {
          const data = JSON.parse(response);

          if (data['alerts']) {
            outputSpeech = handleWeatherAlert(data['alerts']);
            return false;
          }

          const visibilityValue = data['currently']['visibility'];
          const unit = data['flags']['units'];

          outputSpeech = `The average visibility currently in ${locationSlotValue} is ${visibilityValue} ${unit === 'si' ? 'kilometers' : 'miles'}.`;
        })
        .catch((err) => {
          //set an optional error message here
          outputSpeech = err.message;
          //outputSpeech = ERROR_MESSAGE;
        });

      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .getResponse();
    }
  }
};


/* UV INDEX TODAY */
const uVIndexIntentHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'uVIndexIntent');
  },
  async handle(handlerInput) {
    const locationSlotValue = handlerInput.requestEnvelope.request.intent.slots.location.value;
    let outputSpeech = 'This is the default message.';

    if (!locationSlotValue) {
      return handlerInput.responseBuilder
        .speak('Sorry, you need to specify the country or city in your request.')
        .getResponse();
    } else {
      await getRemoteData(`${LOCATIONIQ_API_URL}/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${locationSlotValue}&format=json`)
        .then(response => {
          const data = JSON.parse(response);
          const lng = data[0]['lon'];
          const lat = data[0]['lat'];

          return getRemoteData(`${DARKSKY_API_URL}/forecast/${DARKSKY_API_KEY}/${lat},${lng}?exclude=minutely,hourly&units=auto`);
        })
        .then(response => {
          const data = JSON.parse(response);

          if (data['alerts']) {
            outputSpeech = handleWeatherAlert(data['alerts']);
            return false;
          }

          const uvIndexValue = data['currently']['uvIndex'];

          outputSpeech = `The ultraviolet index currently in ${locationSlotValue} is ${uvIndexValue}.`;
        })
        .catch((err) => {
          //set an optional error message here
          outputSpeech = err.message;
          //outputSpeech = ERROR_MESSAGE;
        });

      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .getResponse();
    }
  }
};


/* CLOUD COVERAGE TODAY */
const cloudCoverageIntentHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'cloudCoverageIntent');
  },
  async handle(handlerInput) {
    const locationSlotValue = handlerInput.requestEnvelope.request.intent.slots.location.value;
    let outputSpeech = 'This is the default message.';

    if (!locationSlotValue) {
      return handlerInput.responseBuilder
        .speak('Sorry, you need to specify the country or city in your request.')
        .getResponse();
    } else {
      await getRemoteData(`${LOCATIONIQ_API_URL}/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${locationSlotValue}&format=json`)
        .then(response => {
          const data = JSON.parse(response);
          const lng = data[0]['lon'];
          const lat = data[0]['lat'];

          return getRemoteData(`${DARKSKY_API_URL}/forecast/${DARKSKY_API_KEY}/${lat},${lng}?exclude=minutely,hourly&units=auto`);
        })
        .then(response => {
          const data = JSON.parse(response);

          if (data['alerts']) {
            outputSpeech = handleWeatherAlert(data['alerts']);
            return false;
          }

          const cloudCoverValue = data['currently']['cloudCover'];

          outputSpeech = `The cloud coverage currently in ${locationSlotValue} is ${cloudCoverValue * 100} percent.`;
        })
        .catch((err) => {
          //set an optional error message here
          outputSpeech = err.message;
          //outputSpeech = ERROR_MESSAGE;
        });

      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .getResponse();
    }
  }
};


/* WIND TODAY */
const windIntentHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'windIntent');
  },
  async handle(handlerInput) {
    const locationSlotValue = handlerInput.requestEnvelope.request.intent.slots.location.value;
    let outputSpeech = 'This is the default message.';

    if (!locationSlotValue) {
      return handlerInput.responseBuilder
        .speak('Sorry, you need to specify the country or city in your request.')
        .getResponse();
    } else {
      await getRemoteData(`${LOCATIONIQ_API_URL}/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${locationSlotValue}&format=json`)
        .then(response => {
          const data = JSON.parse(response);
          const lng = data[0]['lon'];
          const lat = data[0]['lat'];

          return getRemoteData(`${DARKSKY_API_URL}/forecast/${DARKSKY_API_KEY}/${lat},${lng}?exclude=minutely,hourly&units=auto`);
        })
        .then(response => {
          const data = JSON.parse(response);

          if (data['alerts']) {
            outputSpeech = handleWeatherAlert(data['alerts']);
            return false;
          }

          const windSpeed = data['currently']['windSpeed'];
          const unit = data['flags']['units'];
          let windBearing;

          if (data['currently']['windBearing'] === 0 || data['currently']['windBearing'] === 360 || !data['currently']['windBearing']) {
            windBearing = 'north';
          } else if (data['currently']['windBearing'] > 0 && data['currently']['windBearing'] < 90) {
            windBearing = 'north-east';
          } else if (data['currently']['windBearing'] === 90) {
            windBearing = 'east';
          } else if (data['currently']['windBearing'] > 90 && data['currently']['windBearing'] < 180) {
            windBearing = 'south-east';
          } else if (data['currently']['windBearing'] === 180) {
            windBearing = 'south';
          } else if (data['currently']['windBearing'] > 180 && data['currently']['windBearing'] < 270) {
            windBearing = 'south-west';
          } else if (data['currently']['windBearing'] === 270) {
            windBearing = 'west';
          } else if (data['currently']['windBearing'] > 270 && data['currently']['windBearing'] < 360) {
            windBearing = 'noth-west';
          } 

          outputSpeech = `The wind speed currently in ${locationSlotValue} is ${windSpeed} ${unit === 'si' ? 'kilometers' : 'miles'} per hour coming from ${windBearing}.`;
        })
        .catch((err) => {
          //set an optional error message here
          outputSpeech = err.message;
          //outputSpeech = ERROR_MESSAGE;
        });

      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .getResponse();
    }
  }
};


/* PRESSURE TODAY */
const pressureIntentHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'pressureIntent');
  },
  async handle(handlerInput) {
    const locationSlotValue = handlerInput.requestEnvelope.request.intent.slots.location.value;
    let outputSpeech = 'This is the default message.';

    if (!locationSlotValue) {
      return handlerInput.responseBuilder
        .speak('Sorry, you need to specify the country or city in your request.')
        .getResponse();
    } else {
      await getRemoteData(`${LOCATIONIQ_API_URL}/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${locationSlotValue}&format=json`)
        .then(response => {
          const data = JSON.parse(response);
          const lng = data[0]['lon'];
          const lat = data[0]['lat'];

          return getRemoteData(`${DARKSKY_API_URL}/forecast/${DARKSKY_API_KEY}/${lat},${lng}?exclude=minutely,hourly&units=auto`);
        })
        .then(response => {
          const data = JSON.parse(response);

          if (data['alerts']) {
            outputSpeech = handleWeatherAlert(data['alerts']);
            return false;
          }

          const pressureValue = data['currently']['pressure'];

          outputSpeech = `The sea-level air pressure in ${locationSlotValue} is ${pressureValue} millibars.`;
        })
        .catch((err) => {
          //set an optional error message here
          outputSpeech = err.message;
          //outputSpeech = ERROR_MESSAGE;
        });

      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .getResponse();
    }
  }
};


/* HUMIDITY TODAY */
const humidityIntentHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'humidityIntent');
  },
  async handle(handlerInput) {
    const locationSlotValue = handlerInput.requestEnvelope.request.intent.slots.location.value;
    let outputSpeech = 'This is the default message.';

    if (!locationSlotValue) {
      return handlerInput.responseBuilder
        .speak('Sorry, you need to specify the country or city in your request.')
        .getResponse();
    } else {
      await getRemoteData(`${LOCATIONIQ_API_URL}/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${locationSlotValue}&format=json`)
        .then(response => {
          const data = JSON.parse(response);
          const lng = data[0]['lon'];
          const lat = data[0]['lat'];

          return getRemoteData(`${DARKSKY_API_URL}/forecast/${DARKSKY_API_KEY}/${lat},${lng}?exclude=minutely,hourly&units=auto`);
        })
        .then(response => {
          const data = JSON.parse(response);

          if (data['alerts']) {
            outputSpeech = handleWeatherAlert(data['alerts']);
            return false;
          }

          const humidityValue = data['currently']['humidity'];

          outputSpeech = `The relative humidity in ${locationSlotValue} is ${humidityValue *100} percent.`;
        })
        .catch((err) => {
          //set an optional error message here
          outputSpeech = err.message;
          //outputSpeech = ERROR_MESSAGE;
        });

      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .getResponse();
    }
  }
};


/* DEW POINT TODAY */
const dewPointIntentHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'dewPointIntent');
  },
  async handle(handlerInput) {
    const locationSlotValue = handlerInput.requestEnvelope.request.intent.slots.location.value;
    let outputSpeech = 'This is the default message.';

    if (!locationSlotValue) {
      return handlerInput.responseBuilder
        .speak('Sorry, you need to specify the country or city in your request.')
        .getResponse();
    } else {
      await getRemoteData(`${LOCATIONIQ_API_URL}/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${locationSlotValue}&format=json`)
        .then(response => {
          const data = JSON.parse(response);
          const lng = data[0]['lon'];
          const lat = data[0]['lat'];

          return getRemoteData(`${DARKSKY_API_URL}/forecast/${DARKSKY_API_KEY}/${lat},${lng}?exclude=minutely,hourly&units=auto`);
        })
        .then(response => {

          const data = JSON.parse(response);

          if (data['alerts']) {
            outputSpeech = handleWeatherAlert(data['alerts']);
            return false;
          }

          const dewPointValue = String(data['currently']['dewPoint']).split('.')[0];

          outputSpeech = `The dew point currently in ${locationSlotValue} is ${dewPointValue} degrees.`;
        })
        .catch((err) => {
          //set an optional error message here
          outputSpeech = err.message;
          //outputSpeech = ERROR_MESSAGE;
        });

      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .getResponse();
    }
  }
};

/****************************
 * CUSTOM REUSABLE FUNCTIONS *
*****************************/
function handleWeatherAlert(data) {

  const outputSpeech = `Attention! Polarcast has detected an alert for your location, issued by the government in order to warn you. 
  Severity of the alert is - ${data['severity']}.
  ${data['title']} in regions: ${data['regions']}!
  Description of the alert - ${data['description']}.`;

  return outputSpeech;
}

/**************************** 
 * BUILT-IN INTENT HANDLERS * 
*****************************/
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
    // CUSTOM
    HelloIntentHandler,
    SunriseIntentHandler,
    SunsetIntentHandler,
    DayLengthIntentHandler,
    SolarNoonIntentHandler,
    TwilightIntentHandler,
    OzoneDensityIntentHandler,
    TemperatureIntentHandler,
    VisibilityIntentHandler,
    uVIndexIntentHandler,
    cloudCoverageIntentHandler,
    windIntentHandler,
    pressureIntentHandler,
    humidityIntentHandler,
    dewPointIntentHandler,
    // BUILT-IN
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

