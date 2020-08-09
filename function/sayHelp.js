module.exports =

function (msg) {
  var phrases = ["sike", "boo", "never gonna give you up"];
  var say = phrases[Math.floor(Math.random()*phrases.length)];
  var embed = new Discord.MessageEmbed()
  .setTitle("Ougi's `say` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setDescription("Use this command to make Ougi send a message based on your words.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi say " + say + "`")
  .addField("Output", say)

  msg.channel.send({embed}).catch(console.error);
}
