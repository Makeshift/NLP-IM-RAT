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
eval(fs.readFileSync('setup.js')+'');


//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(3978, function () { //Arbitrary port
   console.log('%s listening to %s', server.name, server.url); 
});

//=========================================================
// Modules
// Order must be: UIM Module, IMService Module then NLP Modules
//=========================================================

//Technically this is not how you should import modules. Node.js is modular, and should be treated as such.
//However, it is a simple way of doing it quickly that I'll improve upon properly if I have time.

//User Interaction Module
eval(fs.readFileSync('module-User_Interaction.js')+'');
//IM Service Connector
eval(fs.readFileSync('module-Telegram_Botbuilder.js')+'');
//Natural Language Processing Connector
eval(fs.readFileSync('module-LUIS_connector.js')+'');
//Natural Langauge Processing Module
eval(fs.readFileSync('module-LUIS_NLP.js')+'');
//Intent Processing Module
eval(fs.readFileSync('module-Intent_Processing.js')+'');