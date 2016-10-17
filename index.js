var restify = require('restify');
var builder = require('botbuilder');
var fs = require('fs');

//=========================================================
// Super secret config file import
//=========================================================
eval(fs.readFileSync('config.js')+'');

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
    appId: msAppID,
    appPassword: msAppPass
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
    session.send("Hello World");
});