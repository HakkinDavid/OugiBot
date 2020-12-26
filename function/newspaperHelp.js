module.exports =

async function (msg) {
  var news = ["Ougi woke up with a headache.", "Ougi likes chilaquiles.", "Ougi needs 298 yen.", "Ougi stole " + msg.author.username + "'s chocolate bar."];
  var embed = new Discord.MessageEmbed()
  .setTitle("Ougi's `newspaper` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setDescription("Use this command to preview past updates and important announcements regarding Ougi. You may specify an index, news are sorted from latest to oldest.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi newspaper " + Math.floor(Math.random()*news.length) + "`")
  .addField("Output", news[Math.floor(Math.random()*news.length)])

  msg.channel.send({embed}).catch(console.error);
}
