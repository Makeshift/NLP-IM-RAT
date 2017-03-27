//Azure endpoint
var model = azureModel;
//LUIS Module configuration
var recognizer = new builder.LuisRecognizer(model);
//Takes over from the inbuilt parser to configure intents
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });