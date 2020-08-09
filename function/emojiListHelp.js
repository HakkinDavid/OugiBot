module.exports =

function (msg) {
  var number = ["1", "2", "3"];
  var page = number[Math.floor(Math.random()*number.length)];
  var embed = new Discord.MessageEmbed()
  .setTitle("Ougi's `emoji-list` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setDescription("Take a look at all emoji that Ougi has access to. You can also browse by page.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi emoji-list " + page + "`")

  msg.channel.send({embed}).catch(console.error);
}
