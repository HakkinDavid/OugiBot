module.exports =

async function (msg) {
  if (msg.author.id == davidUserID) {
    while (msg.content.includes('  ')) {
      msg.content = msg.content.replace('  ', ' ')
    }
    while (msg.content.includes('\n\n')) {
      msg.content = msg.content.replace('\n\n', '\n')
    }
    let spookyCake = msg.content;
    let spookySlices = spookyCake.toLowerCase().split(" ");
    let hauntedCommand = spookySlices[1];
    let arguments = spookySlices.slice(2);

    let embed = new Discord.MessageEmbed()
    .setAuthor(msg.author.username, msg.author.avatarURL({dynamic: true, size: 4096}))
    .setDescription("ID `" + msg.author.id + "`")
    .setColor("#FF008C")
    .setFooter("globalLogEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
    .setTimestamp()
    if (hauntedCommand == undefined) {
      embed.addField("No trigger was specified", "\u200B")
    }
    else {
      embed.addField(":warning: **ROOT** command", hauntedCommand);
    }
    if (arguments != "") {
      if (arguments.length < 1024) {
        embed.addField("Arguments", arguments.join(" "))
      }
      else {
        embed.addField("Arguments", arguments.join(" ").slice(0, 1024))
        embed.addField("\u200B", arguments.join(" ").slice(1024))
      }
    }

    client.channels.cache.get(consoleLogging).send({embed}).catch(console.error);

    switch (hauntedCommand){
      case "help":
        ougi.helpRootCommand(arguments, msg)
      break;
      case "status":
        ougi.statusRootCommand(msg)
      break;
      case "log":
        ougi.logRootCommand(arguments, msg)
      break;
      case "shutdown":
        ougi.vibeCheckReallyHard(msg)
      break;
      case "notifysurvey":
        ougi.notifySurvey(msg)
      break;
      case "haunt":
        ougi.hauntRootCommand(arguments, msg)
      break;
      case "tweet":
        ougi.tweetRootCommand(msg)
      break;
      case "newsletter":
        ougi.newsletter(msg)
      break;
      case "switch":
        ougi.switchy(arguments, msg)
      break;
      case "survey":
        ougi.createSurvey(msg)
      break;
      case "ban":
        ougi.banCommand(msg)
      break;
      default:
        ougi.undefinedCommand(arguments, msg)
      break;
    }
  }
  else {
    let options = ["Ara ara! Only David-senpai is allowed to access my root commands", "N-nani? Stop it, my senpai. What are you doing?", "Nani? Nani? Nani? What's going on? Why is my senpai calling me out, using my root commands prefix and trying to peek at them?"];
    let response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).catch(console.error);
    return
  }
}
