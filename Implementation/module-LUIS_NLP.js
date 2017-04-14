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
    //we need to make a text version of the intent template and then eval it to create all our dialogs
    //without the need for the user to manually write them all.
    //As long as it follows the same template for the UI module, it will be fine.
    var intentGenerator = `
    dialog.matches('${match}', [
        function (session, args) {
            //Ensure our user is whitelisted so not everybody can use the system
            if (setup.userWhitelist.indexOf(session.message.user.id) > -1) {
                console.log("Handling intent: ${match}")
                var arguments = {};
                //Handle all our arguments and format them in a predictable way
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
            } else {
                //Deal with people who aren't meant to use the bottle
                session.send("You are not authorised to use this bot. ID: " + session.message.user.id);
            }
        }
    ]); `;
    eval(intentGenerator);
}
//Multi-layered conversation(Dialogue)
bot.dialog('/convo', [
    function(session, args) {
        mUI.intentHandler[args.intent+'Convo'](args.internal, args.count, session.message.user.id, function(type, response, reset) {
            //If reset, we're deleting all of the saved data thus far to pass new data onto the UI module
            if (!reset) {
                session.dialogData.internal = args.internal;
            }
            console.log(session.dialogData);
            //Handles the return from the UI module. If prompt then prompt the user and move onto the next function to handle responses
            //If exit, kill the dialog
            //If else, assume we're sending a one-off message to the user then restart the conversation to query the UI for more data
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
        //This function is called as a second part to a prompt
        //Quickly check if we have internal data stored and fix it if not
        if (typeof session.dialogData.internal != 'object') {
            session.dialogData.internal = [];
       }
       //Push incoming data into the internal data store
        session.dialogData.internal.push(results.response);
        //Hand back off to the start of the conversation to call the UI module again.
        session.replaceDialog('/convo', {intent: session.dialogData.intent, count: session.dialogData.count, internal: session.dialogData.internal})
    }
]);

//Default dialog in case something goes horrifically wrong and LUIS fails to find any intent at all, including no intent
dialog.onDefault(builder.DialogAction.send("I'm sorry, I didn't understand."));