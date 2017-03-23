//Azure endpoint
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/f43bbce5-1aea-48e4-9da5-bfc4c555de86?subscription-key=352ccfbdaab643729246a52f5caccf05&verbose=true&q=';
//LUIS Module configuration
var recognizer = new builder.LuisRecognizer(model);
//Takes over from the inbuilt parser to configure intents
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });