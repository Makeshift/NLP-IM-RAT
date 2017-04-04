//=========================================================
// User Interaction Module
// Description: 
/*
    This file is the user interaction module. It recieves formatted data from the NLP module and works interacts with
    other modules to make a response.
*/
//=========================================================

//List of known intents
//This allows us to have a static list of expected data even in the case that the NLP module changes
var knownIntents = ['none','version','help','ping'];

//Handling of each intent, NLP module agnostic
var intentHandler = {
	none: function(arg, cb) {
		var response = "No intent detected.";
		cb(response);
	},
	version: function(arg, cb) {
		var pjson = require('./package.json');
		var response = "I am version " + pjson.version;
		cb(response);
	},
	help: function(arg, cb) {
		var response = "This is some helpful text.";
		cb(response);
	},
	ping: function(arg, cb) {
		console.log(arg);
		process.ping(arg[0].value.replace(/\s/g, ""), function(response){
			cb(response);
		});
	}
};