module.exports =

async function (arguments, msg) {
  var options = ["I don't get it.", "What do you mean?", "Baka.", "Oh.", "Nani", "Nande"];
  var response = options[Math.floor(Math.random()*options.length)];
  msg.channel.send(response).catch(console.error);
  var embed = new Discord.EmbedBuilder()
  .setTitle("Replied")
  .setDescription(response)
  .setColor("#FF008C")
  .setFooter({text: "globalLogEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  client.channels.cache.get(consoleLogging).send({embeds: [embed]});
  return
}
