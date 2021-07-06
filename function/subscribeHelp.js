module.exports =

async function (msg) {
  var embed = new Discord.MessageEmbed()
  .setTitle("Ougi's `subscribe` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
  .setColor("#230347")
  .setDescription("Use this command to get updates and important announcements regarding Ougi right into your DMs.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField(await ougi.text(msg, "example"), "`ougi subscribe`")
  .addField(await ougi.text(msg, "output"), "Thanks for subscribing, " + msg.author.username + "!")

  msg.channel.send({embed}).catch(console.error);
}
