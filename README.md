# Polarcast

Polarcast is a free & open-source Amazon Alexa skill specifically tailored for meteorologists, atmospheric scientists or people living in extreme conditions that require up-to-date weather information on a daily basis. Alexa makes it easy to communicate and retreive the needed information just by voice commands.

![Polarcast logo](../../../../assets/polarcast_logo.png)

### Available commands & possible examples:
1. Sunrise/Sunset time:
    * when will the sun rise in **[location]**
    * what time is the sunrise in **[location]**
2. Day length:
    * how long will the sun be up in **[location]**
    * for how long am I going to see the sun in **[location]** today
3. Solar noon:
    * what is the solar noon time in **[location]**
    * when will the sun reach its highest point today in **[location]**
4. Twilight time:
    * what is the twilight time in **[location]**
    * what is the dusk time in **[location]**
5. Ozone density:
    * what is the ozone density in **[location]**
    * how dense is the ozone in **[location]** today
6. Temperature:
    * what is the temperature in **[location]**
    * how warm is it in **[location]** today
7. Visibility:
    * what is the visibility leve today in **[location]**
    * how visible is it in **[location]** today
8.  UV index:
    * what is the ultraviolet index in **[location]**
    * how much is the UV index in **[location]** today
9.  Cloud coverage:
    * what is the cloud coverage today in **[location]**
    * how cloudy is **[location]** today
10. Wind:
    * what is the wind speed in **[location]**
    * what is the wind direction in **[location]**
11. Pressure level:
    * what is the air pressure in **[location]**
    * how pressurized is the air today in **[location]**
12. Humidity:
    * what is the air humidity level in **[location]** today
    * how humid is the air today in **[location]**
13. Dew point:
    * what is the dew point in **[location]**
    * what is the air dew point level in **[location]** today


> In order to make our app better and better, we encourage you to suggest possible use cases and intents that could be useful for users.

Since our app was built using the *https://skilltemplates.com/* , the following is the generic documentation for getting start with using their templates and ASK CLI.
### API Starter - Alexa Skill Template

This is an Alexa skill template that provides a simple example of a skill that calls an external API. The API used is the [api.open-notify.org API](http://api.open-notify.org/astros.json) which returns a list of the astronauts currently in space.

### Live example
To try a live example of this skill template, you can enable the [Ground Control Alexa skill](https://www.amazon.com/Dabble-Lab-Ground-Control/dp/B075CWGY1P/ref=sr_1_sc_1?ie=UTF8&qid=1514557483&sr=8-1-spell&keywords=grond+control+alexa+skill). Just say: `Alexa, enable Ground Control` and then `Alexa, open Ground Control`.

### Using this template

This template uses the [Alexa Skills Kit SDK 2.0 for Node.js](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs) and was designed to be used with the [Alexa Skills Kit Command-Line Interface](https://developer.amazon.com/docs/smapi/ask-cli-intro.html) (aka: ASK-CLI). After installing the ASK-CLI you can run the following command to setup a new skill project based on this template.

`$ ask new --template --url http://skilltemplates.com/templates.json`

After running the previous command you'll see of list of templates to choose from. Pick the template named `API Starter`. This will create a new folder named `./api-starter/` all of the code for the template will be located in that folder.

