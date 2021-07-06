module.exports =

async function (msg, commandName) {
  let embed = new Discord.MessageEmbed()
  .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
  .setColor("#230347")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true");
  if (commandName) {
    let title = await ougi.text(msg, "specificHelpTitle");
    embed.setTitle(title.replace(/{commandName}/, "`" + commandName + "`"))
  }
  return embed;
}
