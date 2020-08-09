module.exports =

function (msg) {
  var options = ["I don't get it.", "What do you mean?", "Baka.", "Oh.", "Nani", "Nande"];
  var response = options[Math.floor(Math.random()*options.length)];
  var embed = new Discord.MessageEmbed()
  .setTitle("Ougi's prefix")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setDescription("It's just `ougi`.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi`")
  .addField("Output", response)

  msg.channel.send({embed}).catch(console.error);
}
