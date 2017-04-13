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

var programmedQueries = [
	{
		server: 'floe', //Must be defined in servers.js
		type: 'logs',
		application: 'system',
		logfile: 'auth',
		oldfile: "",
		delay: 60000, //Time in milliseconds between checks of this file
		run: function(cb) { //Formats the data into a user friendly way
			process.getFile(
				{
					protocol: serverDefs.servers[this.server].protocol,
					username: serverDefs.servers[this.server].username,
					password: serverDefs.servers[this.server].password,
					address: serverDefs.servers[this.server].address,
					file: serverDefs.servers[this.server][this.type][this.application][this.logfile],
					userid: 'interm'
				}, function(file) {
					console.log("Oldfile test: " + this.oldfile.length)
					if (this.oldfile.length > 0) {
						//var diff = jsdiff.diffChars(oldfile, file);
						//console.log(diff);
						console.log("Diffs:")
					} else {
						this.oldfile = file;
					}
				}, true);
		},
	}	
];
setInterval(function() {
	programmedQueries[0].run();
}, 5000);