//=========================================================
// Intent Processing Module
// Description: 
/*
    This file processes user requests and returns data back to the User Interaction module.
*/
//=========================================================

//Various imports for functions
var ping = require('ping');
var dns = require('dns');
var traceroute = require('traceroute');
var Client = require('ssh2').Client;
var AnyFile = require('any-file');
var readLastLines = require('read-last-lines');
var setup = require('./setup.js');

module.exports = {
    //List of processes we can use
    process: {
    	//Ping function
        ping: function(address, cb) {
        	//Ping doesn't support using Windows internal DNS, so we do a proper DNS lookup on incoming addresses
        	//before sending it to ping. eg. we want it to be able to take an internal DNS name like Computer001 and
        	//convert it to a local IP.
        	dns.lookup(address, function(err, dnsAddress) {
    	        ping.sys.probe(dnsAddress, function(isAlive) {
    	        	console.log("Pinging address: " + dnsAddress);
    	            var msg = isAlive ? `Host ${address} is alive (Resolved to ${dnsAddress})` : `Host ${address} is dead (Resolved to ${dnsAddress})`;
    	            cb(msg);
    	        }, null, cb);
        	});
        },
        traceroute: function(address, cb) {
        	cb("Tracerouting address "+address+". Could take some time.")
        	traceroute.trace(address, function(err, hops) {
        		console.log("Tracerouting address: " + address);
        		if (err) {
        			console.log(err);
        			cb(err);
        		} else {
        			console.log(hops);
        			//For each hop
        			for (var i = 0; i < hops.length; i++) {
        				//Traceroute returns with an array containing objects. Each object contains
        				//one key(named the IP) containing an array with the millisecond timing of
        				//the ping to each hop (should be 3 pings);
        				//So we average the ping amount and grab the name of the key, calling our callback
        				//each time to send another message.
        				if (typeof hops[i] == "object") {
    	    				var avg = 0;
    	    				var ip = Object.keys(hops[i])[0];
    	    				for (var x = 0; x < hops[i][ip].length; x++) {
    	    					avg += hops[i][ip][x];
    	    				}
    	    				avg = Math.floor(avg / hops[i][ip].length);
    	    				cb("Hop "+i+": "+ip + ", average " + avg + "ms.");
        				} else {
        					cb("Hop "+i+" failed.");
        				}
        			}
        		}
        	});
        },
        ssh: function(connectionData, userID, cb) {
            //SSH connects to a server using the details given by the user, waits for the text to buffer
            //and then returns it the user, exiting cleanly.
        	var conn = new Client();
    		conn.on('ready', function() {
    		  conn.shell(function(err, stream) {
    		    if (err) throw err;
    		    //Allow 500ms for data streaming, otherwise we spam the user pretty hard
    		    //Note that setTimeout is considered synchronous so output ordering is important
    		    //here.
    		    var streamed = "";
    		    setTimeout(function() {
    				console.log(streamed);
    		    	cb(streamed);
    		    	streamed = "";
    		    }, 500)
    		    stream.on('close', function() {
    		      console.log('Connection exited');
    		      conn.end();
    		      cb("Connection ended.");
    		    }).on('data', function(data) {
    		    	streamed += data;
    		    }).stderr.on('data', function(data) {
    		        streamed += data;
    		    });
    		    steam.end('exit\n');
    		  });
    		}).connect({
    		  host: connectionData[0],
    		  port: connectionData[3],
    		  username: connectionData[1],
    		  password: connectionData[2]
    		});
        },
        getFile: function(data, cb) {
        	//Set our defaults early because scp2 doesn't allow us to set a port during the initial connection
        	//And set a couple of others at the same time because we can
        	//Generate the SCP 'from' location as a single line
        	var af = new AnyFile();
        	var fileLoc = `${data.protocol}:\/\/${data.username}:${data.password}@${data.address}${data.file.path}${data.file.file}`;
        	console.log("Grabbing data: " + fileLoc);
        	var localFile = "./downloads/"+data.userid;
            //Download the file locally to a known location 
        	af.from(fileLoc).to(localFile, function(err, res) {
        		if(res) {
    			    console.log("Copy complete, tailing file");
	    			readLastLines.read(localFile, 20).then(function(lines) {
	    				//console.log(lines);
	    				cb(lines.replace("\n", "  \n"));
	    			});
        		} else {
        			console.log("Copy failed, informing user")
        			console.log(err);
        			cb(err);
        		}
        	});
        },
        //This function associates an IM user with a particular alert, so they get alerts that get called by the intermittent query module.
        associate: function(data, session, cb) {
            var queryExists = false;
            //Checks if the query they want to associate with exists
            for (var i = 0; i < require('./module-Intermittent_Query.js').programmedQueries.length; i++) {
                if (require('./module-Intermittent_Query.js').programmedQueries[i].name.toLowerCase() == data.toLowerCase()) {
                    queryExists = true;
                }
            }
            //If it does, add them to the association variable and informs them
            //Else, inform them that their query wasn't found.
            if (queryExists) {
                setup.globalAssociateVar.push([data.toLowerCase(), session.message.address]);
                cb("This conversation has been associated with the query " + data + ". You will receive alerts based on the rules set.")
            } else {
                cb(data + " doesn't exist as a programmed query.")
            }
            //setup.globalAssociateVar.push
        }
    },
}