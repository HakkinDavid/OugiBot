module.exports =

function processCommand(msg) {
    var fullCommand = msg.content.substr(4) // Remove Ougi's name
    var splitCommand = fullCommand.toLowerCase().split(" ") // Split the message up in to pieces for each space
    var primaryCommand = splitCommand[1] // The first word directly after Ougi's name is the command
    var arguments = splitCommand.slice(2) // All other words are arguments/parameters/options for the command

    var event = new Date();
    console.log("__**" + event.toLocaleTimeString('en-US') + "**__\nCommand received: " + primaryCommand + "\nArguments: " + arguments + "\nExecuted by: `" + msg.author.tag + "` with ID: `" + msg.author.id + "`");
    console.log("\n");

    if (primaryCommand == "help") {
        ougi.helpCommand(arguments, msg)
    }

    else if (primaryCommand == "multiply") {
        ougi.multiplyCommand(arguments, msg)
    }

    else if (primaryCommand == "add") {
        ougi.additionCommand(arguments, msg)
    }

    else if (primaryCommand == "say") {
        ougi.sayCommand(arguments, msg)
    }

    else if (primaryCommand == "answer") {
        ougi.answerCommand(arguments, msg)
    }

    else if (primaryCommand == "now"){
        ougi.nowCommand(msg)
    }

    else if (primaryCommand == "image") {
        ougi.imageCommand(arguments, msg)
    }

    else if (primaryCommand == "embed") {
        ougi.embedCommand(arguments, msg)
    }

    else if (primaryCommand == "whisper") {
        ougi.spookyWhisperCommand(arguments, msg)
    }

    else if (primaryCommand == "learn") {
        ougi.talkLearn(arguments, msg)
    }

    else if (primaryCommand == "spookify") {
        ougi.spookifyCommand(arguments, msg)
    }

    else if (primaryCommand == "despookify") {
        ougi.despookifyCommand(arguments, msg)
    }

    else if (primaryCommand == "flushed") {
        ougi.flushedCommand(arguments, msg)
    }

    else if (primaryCommand == "info") {
        ougi.whoIsMe(arguments, msg)
    }
/*--------------Localizations-------------------*/
    else if (primaryCommand == "responde") {
        ougi.respondeComando(arguments, msg)
    }
/*---------------------------------------------*/
    else if (primaryCommand == undefined) {
        ougi.undefinedCommand(arguments, msg)
    }

    else {
        ougi.talkAbility(arguments, msg)
    }
}
