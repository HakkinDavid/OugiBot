module.exports =

function unsubscribeHelp(msg) {
  var embed = new Discord.RichEmbed()
  .setTitle("Ougi's `unsubscribe` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL)
  .setColor("#230347")
  .setDescription("Use this command to stop receiving updates and important announcements regarding Ougi.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi unsubscribe`")
  .addField("Output", "You've successfully unsubscribed Ougi's announcements.")

  msg.channel.send({embed}).catch(console.error);
}
