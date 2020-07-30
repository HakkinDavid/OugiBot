module.exports =

function setlogHelp(msg) {
  var embed = new Discord.RichEmbed()
  .setTitle("Ougi's `setlog` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL)
  .setColor("#230347")
  .setDescription("Use this command to blacklist a trigger in this Discord server, Ougi will start ignoring that input.")
  .addField("Special permission required", ":warning: You must be the owner of whatever Discord server you run this command in.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi remove " + remove + "`")
  .addField("Output", answer)
  .addField("After that, if anyone executes the following", "`ougi " + remove + "`")
  .addField("Output", "Sorry, that's blacklisted in " + msg.guild.toString() + ".")

  msg.channel.send({embed}).catch(console.error);
}
