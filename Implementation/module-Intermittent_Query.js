//=========================================================
// Server Intermittent Query Module: Intermittent_Query
// Description: 
/*
    This module handles automatic queries to users based on incoming server data.
    Has an associated .json file for persistent address saving for users.
*/
//=========================================================

//Imports
var jsdiff = require('diff');
var mIP = require('./module-Intent_Processing.js');
var serverDefs = require('./servers.js');
var setup = require('./setup.js');
var builder = require('botbuilder'); //Microsoft Botbuilder

module.exports = {
	programmedQueries: [
		{
			name: 'floeAuthLogs', //Used to attach users to the alert
			server: 'floe', //Must be defined in servers.js
			type: 'logs',
			application: 'system',
			logfile: 'auth',
			delay: 60000, //Time in milliseconds between checks of this file
			format: function(text) { //Formats the data and only gets data we are interested in
				var whitelist = setup.whitelist; //List of IP addresses that are whitelisted and we don't want notices about failing
				//We still show all logins, regardless of whitelist
				var blacklist = ['Removed session', 'Disconnected from', 'Received disconnect', 'New session', 'session opened', 'session closed', 'connection closed'] //This is a list of strings we know might turn up in our auth logs that we don't care about, and can discard
				for (var i = 0; i < whitelist.length; i++) {
					//Adds 'accepted login' from our whitelisted IP's to be on the blacklist so we don't spam the user with successful logins from the application
					blacklist.push('Accepted password.*'+whitelist[i])
				}
				var lineText = text.split(/(?=[A-Z][a-z][a-z] \d\d \d\d:\d\d:\d\d)/g); //Regex that splits text based on what we know is on each line - The date stamp
				var finalText = "";
				for (var i = 0; i < lineText.length; i++) {
					if (!new RegExp(blacklist.join("|")).test(lineText[i])) { //Little REGEX generator snippet
						finalText += lineText[i]+"  \n";
					}
				}
				return finalText;
			},
			run: function(cb) { //Handles getting the data and sending it 
				//Make a few more variables here because inside the process the 'this' keyword changes, so we can't access
				//object data anymore. Scoping.
				var longFileName = serverDefs.servers[this.server][this.type][this.application][this.logfile];
				var name = this.name.toLowerCase();
				var format = this.format;
				//Generates a getfile object
				mIP.process.getFile(
					{
						protocol: serverDefs.servers[this.server].protocol,
						username: serverDefs.servers[this.server].username,
						password: serverDefs.servers[this.server].password,
						address: serverDefs.servers[this.server].address,
						file: longFileName,
						userid: 'interm'
					}, function(file) {
						//Compares it against the previous file to get the diff
						if (typeof setup.globalCompVar[longFileName.file] === 'undefined') {
							setup.globalCompVar[longFileName.file] = file;
						} else {
							var diff = jsdiff.diffLines(setup.globalCompVar[longFileName.file], file);
							diff.forEach(function(part) {
								
								if (part.added) {
									//Formats it as requested in the above object
									//Sends it to the user based on the associated conversation
									part.value = format(part.value);
									for (var i = 0; i < setup.globalAssociateVar.length; i++) {
										if (setup.globalAssociateVar[i][0] === name && part.value.length > 5) {
											var msgSetup = "Alert has been triggered: " + name + "  \n  \n";
											var msg = new builder.Message().text(msgSetup+part.value).address(setup.globalAssociateVar[i][1]);
											bot.send(msg);
										}
									}
								}
							});
							setup.globalCompVar[longFileName.file] = file;
						}
					});
			},
		}	
	],
}