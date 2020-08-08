module.exports =

function (msg) {
    if (msg.channel.type == "text") {
      ougi.guildLog(msg)
    }
    while (msg.content.includes('  ')) {
      msg.content = msg.content.replace('  ', ' ')
    }
    while (msg.content.includes('\n\n')) {
      msg.content = msg.content.replace('\n\n', '\n')
    }
    while (msg.content.includes('\n')) {
      msg.content = msg.content.replace('\n', ' ')
    }
    var spookyCake = msg.content;
    var spookySlices = spookyCake.toLowerCase().split(" ");
    var spookyCommand = spookySlices[1];
    var arguments = spookySlices.slice(2);

    ougi.globalLog(msg);

    /*Ignore if in blacklist*/
    if (msg.channel.type == "text") {
      var guildID = msg.guild.id;

      var blacklistCheck = JSON.parse(fs.readFileSync('./blacklist.txt', 'utf-8', console.error));

      if (blacklistCheck.hasOwnProperty(guildID)){
        var existent = blacklistCheck[guildID];
        for (var i = 0; i < existent.length; i++) {
          if (existent[i].toLowerCase() === spookySlices.slice(1).join(" ")) {
            msg.channel.send("Sorry, that's blacklisted in " + msg.guild.toString() + ".").then().catch(console.error);
            return
          }
          else if (existent[i].toLowerCase() === spookyCommand) {
            msg.channel.send("Sorry, that's blacklisted in " + msg.guild.toString() + ".").then().catch(console.error);
            return
          }
        }
      }
    }
    /*---------------------*/

    if (spookyCommand == undefined) {
        ougi.undefinedCommand(arguments, msg)
    }

    else if (spookyCommand == "help") {
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

    else if (spookyCommand == "image") {
        ougi.imageCommand(arguments, msg)
    }

    else if (spookyCommand == "embed") {
        ougi.spookyEmbed(msg)
    }

    else if (spookyCommand == "whisper") {
        ougi.spookyWhisperCommand(arguments, msg)
    }

    else if (spookyCommand == "learn" || spookyCommand == "teach") {
        ougi.talkLearn(arguments, msg)
    }

    else if (spookyCommand == "spookify") {
        ougi.spookifyCommand(arguments, msg)
    }

    else if (spookyCommand == "despookify") {
        ougi.despookifyCommand(arguments, msg)
    }

    else if (spookyCommand == "info") {
        ougi.whoIsMe(arguments, msg)
    }

    else if (spookyCommand == "vc") {
        ougi.voiceCall(arguments, msg).then().catch(console.error)
    }

    else if (spookyCommand == "reminder" || spookyCommand == "timer") {
        ougi.spookyReminder(arguments, msg)
    }

    else if (spookyCommand == "translate") {
        ougi.translateCommand(msg)
    }

    else if (spookyCommand.startsWith("translate-")) {
        var method = 1;
        ougi.translateCommand(msg, method)
    }

    else if (spookyCommand == "emoji") {
        ougi.customEmoji(arguments, msg)
    }

    else if (spookyCommand == "emoji-list") {
        ougi.emojiList(arguments, msg)
    }

    else if (spookyCommand == "snipe") {
        ougi.shootSniper(arguments, msg)
    }

    else if (spookyCommand == "subscribe" && arguments.length == 0) {
        ougi.subscribeCommand(msg)
    }

    else if (spookyCommand == "unsubscribe" && arguments.length == 0) {
        ougi.unsubscribeCommand(msg)
    }
/*--------------Localizations-------------------*/
    else if (spookyCommand == "responde") {
        ougi.respondeComando(arguments, msg)
    }
/*----------------Mod Stuff--------------------*/
    else if (spookyCommand == "setlog") {
        ougi.setLog(arguments, msg)
    }

    else if (spookyCommand == "setnews") {
        ougi.setNews(arguments, msg)
    }

    else if (spookyCommand == "remove") {
        ougi.rm(arguments, msg)
    }

    else if (spookyCommand == "allow") {
        ougi.allowCommand(arguments, msg)
    }
/*---------------------------------------------*/
    else {
        ougi.judgementAbility(msg)
    }
}
