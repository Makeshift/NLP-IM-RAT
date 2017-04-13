//=========================================================
// Server Configuration File
// Description: 
/*
    This file contains the connection data for services and servers that is referenced in other parts of the application.
*/
//=========================================================
var setup = require('./setup.js');
module.exports = {
//For reasons of security, the actual logins for the servers are not included in the code.
	servers: {
		//First server, floe
		"floe": {
			address: 'floe.xyz',
			protocol: 'scp',
			port: 8765,
			//Login
			username: setup.floeUser,
			password: setup.floePass,
			//Locations of interest
			logs: {
				//Application specific logs - Apache
				apache:  {
					access: {
						path: "/var/log/apache2/",
						file: "access.log",
					},
					error: {
						path: "/var/log/apache2/",
						file: "error.log"
					}
				},
				//Server specific logs
				system: {
					auth: {
						path: "/var/log/",
						file: "auth.log"
					}
				}
			},
			//Commands that give log-like output
			commands: {
				loginFailLog: "faillog",
				lastLoginLog: "lastlog"
			}
		}
	}
}