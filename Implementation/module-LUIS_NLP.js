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
for (var i = 0; i < mUI.knownIntents.length; i++) {
    var match = mUI.knownIntents[i];
    //Because we can't create new dialog matches in this loop without overwriting them each time
    //we need to make a text version of the intent template and then eval it
    //Which is arguably a bit naughty but as long as we don't allow users to externally add data to this
    //(Which they never can because this is run at startup only) then it will be fine
    var intentGenerator = `
    dialog.matches('${match}', [
        function (session, args) {
            console.log("Handling intent: ${match}")
            //console.log(args);
            var arguments = {};
            for (var i = 0; i < args.entities.length; i++) {
                arguments[args.entities[i].type] = args.entities[i].entity;
            }
            //Sends intent plus data to the UIM for processing, then returns back with the
            //text for the user
            mUI.intentHandler['${match}'](arguments, function(response, replaceMulti, data) {
                //For standard messages
                if (typeof response == "string") {
                    session.send(response);
                } else if (typeof response == "array") {
                    for (var i = 0; i < response.length; i++) {
                        session.send(response[i]);
                    }
                }
                //For initiating a dialog tree
                if (replaceMulti) {
                    console.log(arguments);
                    session.replaceDialog('/convo', {intent: "${match}", internal: [data], count: 0})
                }
            }, session);
            
        }
    ]); `;
    eval(intentGenerator);
}
//Multi-layered conversation(Dialogue)
bot.dialog('/convo', [
    function(session, args) {
        mUI.intentHandler[args.intent+'Convo'](args.internal, args.count, session.message.user.id, function(type, response, reset) {
            if (!reset) {
                session.dialogData.internal = args.internal;
            }
            console.log(session.dialogData);
            if (type == "prompt") {
                session.dialogData.intent = args.intent;
                session.dialogData.count = args.count+1;
                builder.Prompts.text(session, response);
            } else if (type == "exit") {
                console.log("Dialog exited")
                session.cancelDialog();
            } else {
                session.send(response);
                console.log("IN CONVO: " + args.count);
                session.beginDialog('/convo', {intent: args.intent, count: args.count+1, internal: session.dialogData.internal});
            }  
        });
    },
    function(session, results) {
        if (typeof session.dialogData.internal != 'object') {
            session.dialogData.internal = [];
       }
        session.dialogData.internal.push(results.response);
        session.replaceDialog('/convo', {intent: session.dialogData.intent, count: session.dialogData.count, internal: session.dialogData.internal})
    }
]);

//Default dialog in case something goes horrifically wrong and LUIS fails to find any intent at all, including no intent
dialog.onDefault(builder.DialogAction.send("I'm sorry, I didn't understand."));