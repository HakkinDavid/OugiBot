module.exports =

function (msg) {
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

    if (msg.channel.type == "text") {
      ougi.guildLog(msg)
    }

    ougi.globalLog(msg);

    /*---------------------*/

    switch (spookyCommand) {
      case undefined:
        ougi.undefinedCommand(arguments, msg)
      break;

      case "help":
        ougi.helpCommand(arguments, msg)
      break;

      case "multiply":
        ougi.multiplyCommand(arguments, msg)
      break;

      case "add":
        ougi.additionCommand(arguments, msg)
      break;

      case "say":
        ougi.sayCommand(arguments, msg)
      break;

      case "answer":
        ougi.answerCommand(arguments, msg)
      break;

      case "image":
        ougi.imageCommand(arguments, msg)
      break;

      case "embed":
        ougi.spookyEmbed(msg)
      break;

      case "whisper":
        ougi.spookyWhisperCommand(arguments, msg)
      break;

      case "newspaper":
        ougi.newspaper(arguments, msg)
      break;

      case "learn":
        ougi.talkLearn(arguments, msg)
      break;

      case "forget":
        ougi.talkForget(arguments, msg)
      break;

      case "spookify":
        ougi.spookifyCommand(arguments, msg)
      break;

      case "despookify":
        ougi.despookifyCommand(arguments, msg)
      break;

      case "info":
        ougi.whoIsMe(arguments, msg)
      break;

      case "acknowledgement":
        ougi.tos(msg)
      break;

      case "music":
        ougi.voiceCallMusic(msg).then().catch(console.error)
      break;

      case "play":
        ougi.voiceCallMusic(msg).then().catch(console.error)
      break;

      case "p":
        ougi.voiceCallMusic(msg).then().catch(console.error)
      break;

      case "translate":
        ougi.translateCommand(msg)
      break;

      case "emoji":
        ougi.customEmoji(arguments, msg)
      break;

      case "emoji-list":
        ougi.emojiList(arguments, msg)
      break;

      case "snipe":
        ougi.shootSniper(arguments, msg)
      break;

      case "reminder":
        ougi.remindMe(msg)
      break;
  /*--------------Localizations-------------------*/
      case "responde":
        ougi.respondeComando(arguments, msg)
      break;
  /*----------------Mod Stuff--------------------*/
      case "setlog":
        ougi.setLog(arguments, msg)
      break;

      case "setnews":
        ougi.setNews(arguments, msg)
      break;

      case "remove":
        ougi.rm(arguments, msg)
      break;

      case "allow":
        ougi.allowCommand(arguments, msg)
      break;
  /*---------------------------------------------*/
      default:
        if (spookyCommand.startsWith("translate-")) {
          let method = 1;
          ougi.translateCommand(msg, method)
        }

        else if (spookyCommand.toLowerCase().replace("https://", "").replace("www.", "").replace("youtu.be/", "youtube.com/watch?v=").startsWith("youtube.com/watch?v=")) {
          msg.content = msg.content.replace("ougi", "ougi music");
          ougi.voiceCallMusic(msg).then().catch(console.error)
        }

        else if (spookyCommand == "subscribe" && arguments.length == 0) {
          ougi.subscribeCommand(msg)
        }

        else if (spookyCommand == "unsubscribe" && arguments.length == 0) {
          ougi.unsubscribeCommand(msg)
        }

        else {
          ougi.judgementAbility(msg)
        }
    }

}
