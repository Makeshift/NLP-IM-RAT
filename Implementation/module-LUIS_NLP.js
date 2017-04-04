//=========================================================
// NLP Module: LUIS_NLP
// Description: 
/*
    This file is the NLP management module.
    This contains all 'matches' for the NLP system, formats incoming data and sends it to the user interaction module.
*/
//=========================================================

bot.dialog('/', dialog);

//Grabs known intents from user interaction module, creates a template handler for each
for (var i = 0; i < knownIntents.length; i++) {
    var match = knownIntents[i];
    //Because we can't create new dialog matches in this loop without overwriting them each time
    //we need to make a text version of the intent template and then eval it
    //Which is arguably a bit naughty but as long as we don't allow users to externally add data to this
    //(Which they never can because this is run at startup only) then it will be fine
    var intentGenerator = `
    dialog.matches('${match}', [
        function (session, args) {
            console.log("Handling intent: ${match}")
            //console.log(args);
            var arguments = [];
            for (var i = 0; i < args.entities.length; i++) {
                arguments.push({
                    name: args.entities[i].type,
                    value: args.entities[i].entity
                });
            }
            //Sends intent plus data to the UIM for processing, then returns back with the
            //text for the user
            intentHandler['${match}'](arguments, function(response) {
                session.send(response);
            });
            
        }
    ]); `;
    eval(intentGenerator);
}

//Default dialog in case something goes horrifically wrong and LUIS fails to find any intent at all, including no intent
dialog.onDefault(builder.DialogAction.send("I'm sorry, I didn't understand."));