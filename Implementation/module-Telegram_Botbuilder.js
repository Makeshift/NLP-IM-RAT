//=========================================================
// IM Service Connector: telegram-botbuilder
// Description: 
/*
	Technically botbuilder handles all the connections for Skype, Telegram, Slack and other services(as it is a 'universal' bot)
	so this module is just here to act as a known location for it. If we needed to connect to IRC or something not supported by
	botbuilder, we would expand upon/replace this module.
*/
//=========================================================

// Create chat bot
var connector = new builder.ChatConnector({
    appId: appId,
    appPassword: appPassword
});
var bot = new builder.UniversalBot(connector);
//Opens up a post endpoint for the connector to listen on
server.post('/api/messages', connector.listen());