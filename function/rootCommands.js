module.exports =

async function (msg) {
  if (msg.author.id == "265257341967007758") {
    while (msg.content.includes('  ')) {
      msg.content = msg.content.replace('  ', ' ')
    }
    while (msg.content.includes('\n\n')) {
      msg.content = msg.content.replace('\n\n', '\n')
    }
    let spookyCake = msg.content;
    let spookySlices = spookyCake.toLowerCase().split(" ");
    var hauntedCommand = spookySlices[1];
    var arguments = spookySlices.slice(2);

    var event = new Date();

    var embed = new Discord.MessageEmbed()
    .setAuthor(msg.author.tag, msg.author.avatarURL())
    .setDescription("ID `" + msg.author.id + "`")
    .setColor("#FF008C")
    .setFooter("globalLogEmbed by Ougi", client.user.avatarURL())
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

    client.channels.cache.get(consoleLogging).send({embed}).then().catch(console.error);

    if (hauntedCommand == "help") {
        ougi.helpRootCommand(arguments, msg)
    } else if (hauntedCommand == "status") {
        ougi.statusRootCommand(msg)
    } else if (hauntedCommand == "log") {
        ougi.logRootCommand(arguments, msg)
    } else if (hauntedCommand == "vibe_check") {
        ougi.vibeCheckReallyHard(arguments, msg)
    } else if (hauntedCommand == "haunt") {
        ougi.hauntRootCommand(arguments, msg)
    } else if (hauntedCommand == "tweet") {
        ougi.tweetRootCommand(msg)
    } else if (hauntedCommand == "newsletter") {
        ougi.newsletter(msg)
    } else {
        ougi.undefinedCommand(arguments, msg)
    }
  }
  else {
    var options = ["Ara ara! Only David-senpai is allowed to access my root commands", "N-nani? Stop it, my senpai. What are you doing?", "Nani? Nani? Nani? What's going on? Why is my senpai calling me out, using my root commands prefix and trying to peek at them?"];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
    return
  }
}
