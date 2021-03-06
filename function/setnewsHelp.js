module.exports =

async function (msg) {
  let embed = new Discord.MessageEmbed()
  .setTitle("Ougi's `setnews` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
  .setColor("#230347")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true");
  if (msg.channel.type != "text") {
    embed.addField("This is only available in Discord servers.", ":warning: You must be in a Discord server in order to preview information about this command.")
    msg.channel.send(embed).catch(console.error);
    return
  }
  embed.setDescription("Use this command to set a channel where to send important announcements and updates about Ougi. If no channel is mentioned, Ougi will use the channel you run the command in.")
  .addField("Special permission required", ":warning: You must be the owner of whatever Discord server you run this command in.")
  .addField(await ougi.text(msg, "example"), "`ougi setnews `" + msg.channel.toString() + "` `")
  .addField(await ougi.text(msg, "output"), "I'll start sending updates and related information into " + msg.channel.toString() + ".")
  .addField("You may also disable this function", "`ougi setnews disable`")
  .addField(await ougi.text(msg, "output"), "Newsletter channel successfully disabled.")

  msg.channel.send(embed).catch(console.error);
}
