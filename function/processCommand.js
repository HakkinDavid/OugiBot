module.exports =

async function (msg) {
    while (msg.content.includes('  ')) {
      msg.content = msg.content.replace('  ', ' ')
    }
    while (msg.content.includes('\n\n')) {
      msg.content = msg.content.replace('\n\n', '\n')
    }
    while (msg.content.includes('\n')) {
      msg.content = msg.content.replace('\n', ' ')
    }
    let spookyCake = msg.content;
    let spookySlices = spookyCake.toLowerCase().split(" ");
    let spookyCommand = spookySlices[1];
    let arguments = spookySlices.slice(2);
    let mustHavePerms = ["ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "MANAGE_WEBHOOKS"];

    /*Ignore if in blacklist*/
    if (msg.channel.type == "text") {
      let guildID = msg.guild.id;

      if (settingsOBJ.blacklist.hasOwnProperty(guildID)){
        let existent = settingsOBJ.blacklist[guildID];
        for (i = 0; i < existent.length; i++) {
          if (existent[i].toLowerCase() === spookySlices.slice(1).join(" ")) {
            msg.channel.send("Sorry, that's blacklisted in " + msg.guild.toString() + ".").catch(console.error);
            return
          }
          else if (existent[i].toLowerCase() === spookyCommand) {
            msg.channel.send("Sorry, that's blacklisted in " + msg.guild.toString() + ".").catch(console.error);
            return
          }
        }
      }
    }

    if (msg.channel.type == "text") {
      ougi.guildLog(msg);
    }

    ougi.globalLog(msg);
    if (!await ougi.checkPerms(msg, mustHavePerms)) {
        return
    }

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

      case "dice":
        ougi.dice(msg)
      break;

      case "answer":
        ougi.answerCommand(arguments, msg)
      break;

      case "image":
        ougi.imageCommand(arguments, msg)
      break;

      case "curl":
        ougi.curl(msg)
      break;

      case "embed":
        ougi.spookyEmbed(msg)
      break;

      case "covidnews":
        ougi.covidNEWS(msg)
      break;

      case "covidstats":
        ougi.covidstats(arguments, msg)
      break;

      case "covid":
        ougi.covidAmbiguousCommandManager(arguments, msg)
      break;

      case "covid-19":
        ougi.covidAmbiguousCommandManager(arguments, msg)
      break;

      case "healthcare":
        ougi.healthcare(msg)
      break;

      case "md":
        ougi.medicalDefinition(arguments, msg)
      break;

      case "stats":
        ougi.statsCommand(msg)
      break;

      case "tweet":
        ougi.tweet(msg)
      break;

      case "minesweeper":
        ougi.minesweeper(msg)
      break;

      case "newspaper":
        ougi.newspaper(arguments, msg)
      break;

      case "recipe":
        ougi.recipeCommand(arguments, msg)
      break;

      case "learn":
        ougi.talkLearn(arguments, msg)
      break;

      case "forget":
        ougi.talkForget(arguments, msg)
      break;

      case "info":
        ougi.whoIsMe(arguments, msg)
      break;

      case "acknowledgement":
        ougi.tos(msg)
      break;

      case "music":
        ougi.voiceCallMusic(msg).catch(console.error)
      break;

      case "skip":
        msg.content = "ougi music skip";
        ougi.voiceCallMusic(msg).catch(console.error)
      break;

      case "remove":
        msg.content = "ougi music remove " + arguments.join(" ");
        ougi.voiceCallMusic(msg).catch(console.error)
      break;

      case "lyrics":
        ougi.lyrics(arguments, msg).catch(console.error)
      break;

      case "play":
        ougi.voiceCallMusic(msg).catch(console.error)
      break;

      case "p":
        ougi.voiceCallMusic(msg).catch(console.error)
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
        ougi.shootSniper(arguments, msg, false)
      break;

      case "editsnipe":
        ougi.shootSniper(arguments, msg, true)
      break;

      case "speak":
        ougi.voice(msg)
      break;

      case "reminder":
        ougi.remindMe(msg)
      break;
  /*----------------Mod Stuff--------------------*/
      case "prefix":
        ougi.prefix(arguments, msg)
      break;
      case "setlog":
        ougi.setLog(arguments, msg)
      break;

      case "setnews":
        ougi.setNews(arguments, msg)
      break;

      case "blacklist":
        ougi.rm(arguments, msg)
      break;

      case "allow":
        ougi.allowCommand(arguments, msg)
      break;

      case "language":
        ougi.lang(arguments, msg, false)
      break;

      case "survey":
        ougi.feedback(msg, true)
      break;

      case "results":
        ougi.results(msg)
      break;

      case "endsurvey":
        ougi.results(msg, true)
      break;

      case "guildlanguage":
        ougi.lang(arguments, msg, true)
      break;
  /*---------------------------------------------*/
      default:
        if (spookyCommand.startsWith("translate-")) {
          let method = 1;
          ougi.translateCommand(msg, method)
        }

        else if (spookyCommand.toLowerCase().replace("https://", "").replace("www.", "").replace("youtu.be/", "youtube.com/watch?v=").startsWith("youtube.com/watch?v=")) {
          msg.content = msg.content.replace("ougi", "ougi music");
          ougi.voiceCallMusic(msg).catch(console.error)
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

    ougi.feedback(msg);
}
