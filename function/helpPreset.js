module.exports =

async function (msg, commandName) {
  let title = await ougi.text(msg, "specificHelpTitle");
  let embed = new Discord.MessageEmbed()
  .setTitle(title.replace(/{commandName}/, "`" + commandName + "`"))
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true");
  return embed;
}
