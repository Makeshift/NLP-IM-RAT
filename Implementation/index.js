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
var bot = new builder.UniversalBot(connector);
//Opens up a post endpoint for the connector to listen on
server.post('/api/messages', connector.listen());
//=========================================================
// Modules
// Order must be: UIM Module, IMService Module then NLP Modules
//=========================================================

//Technically this is not how you should import modules. Node.js is modular, and should be treated as such.
//However, it is a simple way of doing it quickly that is also fairly user friendly for a client to do.

//User Interaction Module
var mUI = require('./module-User_Interaction.js');

//Natural Language Processing Connector
eval(fs.readFileSync('module-LUIS_connector.js')+'');
//Natural Langauge Processing Module
    //LUIS Module configuration
    var recognizer = new builder.LuisRecognizer(setup.azureModel);
    //Takes over from the inbuilt parser to configure intents
    var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
//Intent Processing Module
eval(fs.readFileSync('module-Intent_Processing.js')+'');
//Server list
var serverDefs = require('./servers.js');
//Intermittent Server Query Module
eval(fs.readFileSync('module-Intermittent_Query.js')+'');
//Debug file
eval(fs.readFileSync('test.js')+'');