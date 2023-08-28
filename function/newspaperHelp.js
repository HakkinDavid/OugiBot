module.exports =

async function (msg) {
  var news = ["Ougi woke up with a headache.", "Ougi likes chilaquiles.", "Ougi needs 298 yen.", "Ougi stole " + msg.author.username + "'s chocolate bar."];
  var embed = new Discord.EmbedBuilder()
  .setTitle("Ougi's `newspaper` command")
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setDescription("Use this command to preview past updates and important announcements regarding Ougi. You may specify an index, news are sorted from latest to oldest.")
  .setFooter({text: "helpEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi newspaper " + Math.floor(Math.random()*news.length) + "`"})
  .addFields({name: await ougi.text(msg, "output"), value: news[Math.floor(Math.random()*news.length)]})

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
