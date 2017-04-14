//=========================================================
// User Interaction Module
// Description: 
/*
    This file is the user interaction module. It recieves formatted data from the NLP module and works interacts with
    other modules to make a response.
*/
//=========================================================
var mIP = require('./module-Intent_Processing.js');
var serverDefs = require('./servers.js');
module.exports = {
	//List of known intents
	//This allows us to have a static list of expected data even in the case that the NLP module changes
	//This list does not include 'extended' intents, such as the +Convo modifier, which allows for multi-stage dialogs
	knownIntents: ['none','version','help','ping','traceroute','ssh','identify','logs','associate'],

	//Handling of each intent, NLP module agnostic
	intentHandler: {
		//This handler is called if Luis detects the 'none' intent, which is full of nonsense phrases designed to illicit a response
		//but not do anything meaningful.
		none: function(arg, cb) {
			var response = "No intent detected.";
			cb(response);
		},
		//This handler is called if Luis detects the 'version' intent, such as "What version are you?" or simply just "Version".
		//It replies with the verison as specified in the application package file.
		version: function(arg, cb) {
			var pjson = require('./package.json');
			var response = "I am version " + pjson.version;
			cb(response);
		},
		//This handler is called if Luis detects the 'help' intent, such as "What am I doing?" or simply just "help".
		//It replies with predefined help text.
		help: function(arg, cb) {
			var response = `Currently known intents  \n
			Version: (what version are you, tell me your version, what is your version) Responds with current version  \n
			Help: (help me, help, /start) Responds with this  \n
			Ping: (ping address, can you ping address for me, please ping address) Tells you if a given endpoint is up  \n
			Traceroute: (traceroute address, perform a traceroute against address, start traceroute to) Performs a traceroute against a given address  \n
			SSH: (open ssh with address, open address, shell addresss, ssh address) Starts a dialog to get information, then opens a shell connection to a machine, returning the given text before exiting  \n
			Identify: (identify, who am I) Sends identify information the bot knows about you, such as your user ID and IM service (Mostly for debugging)  \n
			Logs: (get the aplication specific logs for server) Queries the known server list to get log data from a particular application on a server  \n
			Associate: (associate x, associate me with x) Associates this conversation with a hardcoded intermittent query. You will then receive alerts from this query.
			`;
			cb(response);
		},
		//This handler is called if Luis detects the 'ping' intent, such as "is -server- up?, "is -server- online?" or "ping server".
		//It defers to the intent processing module to deal with the actual processing after sanitizing the input
		//and acts as middleware between the LUIS and proccessing modules.
		ping: function(arg, cb) {
			console.log(arg);
			mIP.process.ping(arg.arguments.replace(/\s/g, ""), function(response){
				cb(response);
			});
		},
		//This handler is called if Luis detects the 'traceroute' intent, and responds to 'traceroute server', 'trace a route to x server' or similar
		//Similarly, it defers processing to the processing module after sanitizing input.
		traceroute: function(arg, cb) {
			console.log(arg);
			mIP.process.traceroute(arg.arguments.replace(/\s/g, ""), function(response) {
				cb(response);
			});
		},
		//This handler is called if Luis detects the 'identify' intent. It responds to "Who am I?", "identify", "identify me", and similar phrases.
		//This is primarily a debug handler, and just outputs data scraped from the session related to the user.
		identify: function(arg, cb, session) {
			console.log("Identifying the user");
			cb(`Address ID: ${session.message.address.id}  \nUsing: ${session.message.address.channelId}  \nUser ID: ${session.message.user.id}  \nUsername: ${session.message.user.name}`);
			cb("Use the 'associate' command to associate this conversation with an alert.");
		},
		//This handler is called if Luis detects the 'ssh' intent. It only responds to 'ssh -server-'. It then forces the
		//conversation handler to hand off to another handler, designed better for multi-message dialogue and response.
		ssh: function(arg, cb) {
			console.log(arg);
			var address = arg.arguments.replace(/\s/g, "");
			cb("Starting shell session with " + address, true, address);
		},
		//This handler is called by the previous SSH handler, and uses a counter system to loop through the conversation to get
		//different data from the user. This data is then sent to the intent processing module to open a connection.
		sshConvo: function(data, count, userID, cb) {
			console.log("SSHCONVO: " + count);
			console.log("USERID: " + userID);
			//Each time sshConvo is called it cycles to the next counter
			//This is a proof of concept to prove that a multi-layered dialog plus waiting for callbacks can work
			//However it does not actually forward commands to the server, it simply exits when the text has
			//finished buffering from the server
			if (count == 0) {
				cb("prompt", "Using what username?");
			} else if (count == 1) {
				cb("prompt", "Using what password?");
			} else if (count == 2) {
				cb("prompt", "On what port?");
			} else if (count == 3) {
				cb("text", `Connecting to ${data[0]} with user '${data[1]}' and your specified password on port ${data[3]}...`);
				mIP.process.ssh(data, userID, function(response) {
					cb("text", response);
					cb("text", "Connected. Further commands will be forwarded to the server. Type 'exit' to exit session.", true);
				});
			} else if (count == 4) {
				cb("prompt", "Buffering login text...", true);
			} else if (count >= 5) {
				cb("exit");
			}
		},
		//This handler is called if Luis detects the 'logs' intent. It detects the $application, $argument and $server from the users
		//message and works out exactly what the user is trying to do, before passing it off to intent processing.
		logs: function(arg, cb, session) {
			try {
				//Generate the getFile object so we don't have to deal with it later
				mIP.process.getFile({
					protocol: serverDefs.servers[arg.server].protocol,
					address: serverDefs.servers[arg.server].address,
					port: serverDefs.servers[arg.server].port,
					username: serverDefs.servers[arg.server].username,
					password: serverDefs.servers[arg.server].password,
					file: serverDefs.servers[arg.server].logs[arg.application][arg.arguments],
					userid: session.message.user.id
				}, function(line) {
					//Call back with the lines to inform the user
					cb(line);
				});
			} catch (e) {
				//Try/catch to try and grab any specific errors - The big one being an undefined when looking for a server that doesn't exist
				//So let's tell the user about it and see if they can fix their syntax.
				console.log(e);
				cb(`We weren't able to find the correct path for the specified server. Here's what we got from your message:  \nServer: ${arg.server}  \nApplication: ${arg.application}  \nSubsection: ${arg.arguments}`)
			}
		},
		//This handler is called if Luis detects the 'associate' intent. Such as 'associate me with x' or 'associate x'. This sends
		//the argument and session off to the intent processor.
		associate: function(args, cb, session) {
			mIP.process.associate(args.arguments, session, function(response) {
				cb(response);
			});
		}
	}
};