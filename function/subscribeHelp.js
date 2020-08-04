module.exports =

function subscribeHelp(msg) {
  var embed = new Discord.RichEmbed()
  .setTitle("Ougi's `subscribe` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL)
  .setColor("#230347")
  .setDescription("Use this command to get updates and important announcements regarding Ougi right into your DMs.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi subscribe`")
  .addField("Output", "Thanks for subscribing, " + msg.author.username + "!")

  msg.channel.send({embed}).catch(console.error);
}
