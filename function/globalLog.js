module.exports =

function globalLog(msg) {
  var spookyCake = msg.cleanContent;
  var spookySlices = spookyCake.toLowerCase().split(" ");
  var spookyCommand = spookySlices[1];
  var arguments = spookySlices.slice(2);

  var embed = new Discord.RichEmbed()
  .setAuthor(msg.author.tag, msg.author.avatarURL)
  .setDescription("ID `" + msg.author.id + "`")
  .setColor("#FF008C")
  .setFooter("globalLogEmbed by Ougi", client.user.avatarURL)
  .setTimestamp()
  if (spookyCommand == undefined) {
    embed.addField("No trigger was specified", "\u200B")
  }
  else {
    embed.addField("Trigger", spookyCommand);
  }
  if (arguments != "") {
    arguments = arguments.join(" ");
    embed.addField("Arguments", arguments);
  }

  client.channels.get(consoleLogging).send({embed});
}
