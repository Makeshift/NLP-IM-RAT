//=========================================================
// NLP Connector: LUIS_Connector
// Description: 
/*
    This file sets up the connector to the LUIS NLP engine.
*/
//=========================================================

//Azure endpoint
var model = azureModel;
//LUIS Module configuration
var recognizer = new builder.LuisRecognizer(model);
//Takes over from the inbuilt parser to configure intents
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });