//=========================================================
// Intent Processing Module
// Description: 
/*
    This file processes user requests and returns data back to the User Interaction module.
*/
//=========================================================
var ping = require('ping');
var dns = require('dns');
var process = {
    ping: function(address, cb) {
    	dns.lookup(address, function(err, dnsAddress) {
	        ping.sys.probe(dnsAddress, function(isAlive) {
	        	console.log("Pinging address: " + dnsAddress);
	            var msg = isAlive ? `Host ${address} is alive (Resolved to ${dnsAddress})` : `Host ${address} is dead (Resolved to ${dnsAddress})`;
	            cb(msg);
	        }, null, cb);
    	});
    }
};