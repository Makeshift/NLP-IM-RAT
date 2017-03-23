var restify = require('restify');
var builder = require('botbuilder');
var fs = require('fs');

//=========================================================
// Modules
//=========================================================
//Luis
eval(fs.readFileSync('luis.js')+'');

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
    appId: "2484adc1-a7c3-4ce2-ad53-c428f20faa61",
    appPassword: "HCydVsGO6pu46tqes51BZBh"
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', dialog);

//Basic intents test
dialog.matches('none', [
    function (session, args) {
        session.send("No intent detected.");
    }
]);

dialog.matches('version', [
    function (session, args) {
    	var pjson = require('./package.json');
        session.send("I am version " + pjson.version);
    }
]);

dialog.matches('help', [
    function (session, args) {
        session.send("This is some helpful text.");
    }
]);

dialog.matches('ping', [
    function (session, args) {
        // Resolve and store any entities passed from LUIS.
        var arguments = builder.EntityRecognizer.findEntity(args.entities, 'arguments');
        console.log(arguments);
        session.send("You wish me to ping " + arguments.entity);
    }
]);

dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand. I only support 'ping' at the moment."));