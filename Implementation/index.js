//=========================================================
// NLPIMRAT
// Description: 
/*
    This file is the one you start to start the app. It contains all of the required includes for it to work,
    as well as the initial bot setup and importing of all the modules.
*/
//=========================================================

//Required includes
var restify = require('restify'); //HTTP server
var builder = require('botbuilder'); //Microsoft Botbuilder
var fs = require('fs'); //Filesystem access

//Special setup file with all my hidden vars
var setup = require('./setup.js');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(3978, function () { //Arbitrary port
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: setup.appId,
    appPassword: setup.appPassword
});
bot = new builder.UniversalBot(connector);
//Opens up a post endpoint for the connector to listen on
server.post('/api/messages', connector.listen());
//=========================================================
// Modules
//=========================================================

//User Interaction Module
var mUI = require('./module-User_Interaction.js');
//Natural Langauge Processing Module
//LUIS Module configuration
var recognizer = new builder.LuisRecognizer(setup.azureModel);
//Takes over from the inbuilt parser to configure intents
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
//Import the actual LUIS module as an eval for simplicity - There are so many references
//to variables in other files it is a lot simpler to keep it as an eval rather than converting it into a module.
eval(fs.readFileSync('module-LUIS_NLP.js')+'');
//Intent Processing Module
var mIP = require('./module-Intent_Processing.js');
//Server list
var serverDefs = require('./servers.js');
//Intermittent Server Query Module
var mIQ = require('./module-Intermittent_Query.js');
//Global timer for Intermittent Queries
(function() {
    for (var i = 0; i < mIQ.programmedQueries.length; i++) {
        setInterval(function(x) {
            mIQ.programmedQueries[x].run();
        }, mIQ.programmedQueries[i].delay, i);
    }
}());