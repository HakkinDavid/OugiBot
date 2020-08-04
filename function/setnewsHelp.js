module.exports =

function setnewsHelp(msg) {
  if (msg.channel.type != "text") {
    var embed = new Discord.RichEmbed()
    .setTitle("Ougi's `setnews` command")
    .setAuthor("Ougi [BOT]", client.user.avatarURL)
    .setColor("#230347")
    .setFooter("helpEmbed by Ougi", client.user.avatarURL)
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
    .addField("This is only available in Discord servers.", ":warning: You must be in a Discord server in order to preview information about this command.")
    msg.channel.send({embed}).catch(console.error);
    return
  }
  var embed = new Discord.RichEmbed()
  .setTitle("Ougi's `setnews` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL)
  .setColor("#230347")
  .setDescription("Use this command to set a channel where to send important announcements and updates about Ougi. If no channel is mentioned, Ougi will use the channel you run the command in.")
  .addField("Special permission required", ":warning: You must be the owner of whatever Discord server you run this command in.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi setnews `" + msg.channel.toString() + "` `")
  .addField("Output", "I'll start sending updates and related information into " + msg.channel.toString() + ".")
  .addField("You may also disable this function", "`ougi setnews disable`")
  .addField("Output", "Newsletter channel successfully disabled.")

  msg.channel.send({embed}).catch(console.error);
}
