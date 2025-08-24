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

    let embed = new Discord.EmbedBuilder()
    .setAuthor({name: msg.author.username, icon: msg.author.avatarURL({dynamic: true, size: 4096})})
    .setDescription("ID `" + msg.author.id + "`")
    .setColor("#FF008C")
    .setFooter({text: "globalLogEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
    .setTimestamp()
    if (hauntedCommand == undefined) {
      embed.addFields({name: "No trigger was specified", value: "\u200B"})
    }
    else {
      embed.addFields({name: ":warning: **ROOT** command", value: hauntedCommand});
    }
    if (arguments != "") {
      if (arguments.length < 1024) {
        embed.addFields({name: "Arguments", value: arguments.join(" ")})
      }
      else {
        embed.addFields({name: "Arguments", value: arguments.join(" ").slice(0, 1024)})
        embed.addFields({name: "\u200B", value: arguments.join(" ").slice(1024)})
      }
    }

    client.channels.cache.get(consoleLogging).send({embeds: [embed]}).catch(console.error);

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
      case "patron":
        ougi.patronCommand(msg)
      break;
      case "inspect":
        ougi.inspectCommand(msg)
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
