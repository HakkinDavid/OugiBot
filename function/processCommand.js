module.exports =

function processCommand(msg) {
    while (msg.content.includes('  ')) {
      msg.content = msg.content.replace('  ', ' ')
    }
    msg.content = msg.content.replace("<@629837958123356172>", "ougi").replace("扇", "ougi");
    var spookyCake = msg.content.substr(4);
    var spookySlices = spookyCake.toLowerCase().split(" ");
    var spookyCommand = spookySlices[1];
    var arguments = spookySlices.slice(2);

    var event = new Date();
    console.log("__**" + event.toLocaleTimeString('en-US') + "**__\nCommand received: " + spookyCommand + "\nArguments: " + arguments + "\nExecuted by: `" + msg.author.tag + "` with ID: `" + msg.author.id + "`");

    if (spookyCommand == "help") {
        ougi.helpCommand(arguments, msg)
    }

    else if (spookyCommand == "multiply") {
        ougi.multiplyCommand(arguments, msg)
    }

    else if (spookyCommand == "add") {
        ougi.additionCommand(arguments, msg)
    }

    else if (spookyCommand == "say") {
        ougi.sayCommand(arguments, msg)
    }

    else if (spookyCommand == "answer") {
        ougi.answerCommand(arguments, msg)
    }

    else if (spookyCommand == "now") {
        ougi.nowCommand(msg)
    }

    else if (spookyCommand == "image") {
        ougi.imageCommand(arguments, msg)
    }

    else if (spookyCommand == "embed") {
        ougi.embedCommand(arguments, msg)
    }

    else if (spookyCommand == "whisper") {
        ougi.spookyWhisperCommand(arguments, msg)
    }

    else if (spookyCommand == "learn") {
        ougi.talkLearn(arguments, msg)
    }

    else if (spookyCommand == "spookify") {
        ougi.spookifyCommand(arguments, msg)
    }

    else if (spookyCommand == "despookify") {
        ougi.despookifyCommand(arguments, msg)
    }

    else if (spookyCommand == "flushed") {
        ougi.flushedCommand(arguments, msg)
    }

    else if (spookyCommand == "info") {
        ougi.whoIsMe(arguments, msg)
    }

    else if (spookyCommand == "vc") {
        ougi.voiceCall(arguments, msg)
    }
/*--------------Localizations-------------------*/
    else if (spookyCommand == "responde") {
        ougi.respondeComando(arguments, msg)
    }
/*---------------------------------------------*/
    else if (spookyCommand == undefined) {
        ougi.undefinedCommand(arguments, msg)
    }

    else {
        ougi.talkAbility(msg)
    }
}
