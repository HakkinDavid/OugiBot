module.exports =

async function (msg) {
  let spookyCake = msg.content;
  let spookySlices = spookyCake.split(" ");
  let spookyCommand = spookySlices[1];
  var arguments = spookySlices.slice(2);

  var embed = new Discord.MessageEmbed()
  .setAuthor(msg.author.tag, msg.author.avatarURL({dynamic: true, size: 4096}))
  .setDescription("ID `" + msg.author.id + "`")
  .setColor("#FF008C")
  .setFooter("globalLogEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
  .setTimestamp()
  if (spookyCommand == undefined) {
    embed.addField("No trigger was specified", "\u200B")
  }
  else {
    embed.addField("Command", spookyCommand);
  }
  if (arguments != "") {
    arguments = arguments.join(" ");
    if (arguments.length < 1024) {
      embed.addField("Arguments", arguments)
    }
    else {
      embed.addField("Arguments", arguments.slice(0, 1024))
      embed.addField("\u200B", arguments.slice(1024))
    }
  }

  client.channels.cache.get(consoleLogging).send({embed});
}
