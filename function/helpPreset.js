module.exports =

async function (msg, commandName) {
  let embed = new Discord.MessageEmbed()
  .setTitle(await ougi.text(msg, commandName + "HelpTitle"))
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true");
  return embed;
}
