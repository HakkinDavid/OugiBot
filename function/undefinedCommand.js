module.exports =

function undefinedCommand(arguments, msg) {
  var options = ["I don't get it.", "What do you mean?", "Baka.", "Oh.", "Nani", "Nande"];
  var response = options[Math.floor(Math.random()*options.length)];
  msg.channel.send(response).then().catch(console.error);
  var embed = new Discord.RichEmbed()
  .setTitle("Replied")
  .setDescription(response)
  .setColor("#FF008C")
  .setFooter("globalLogEmbed by Ougi", client.user.avatarURL)
  client.channels.get(consoleLogging).send({embed});
  return
}
