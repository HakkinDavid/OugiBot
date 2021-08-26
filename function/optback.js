module.exports =

async function (msg) {
  let index = settingsOBJ.ignored.indexOf(msg.author.id);
  settingsOBJ.ignored.splice(index);
  let embed = new Discord.MessageEmbed()
  .setTitle("Opt In to Ougi")
  .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
  .setColor("#230347")
  .setDescription("You've successfully opted in to use Ougi and its services.")
  .setFooter("optoutEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  msg.channel.send({embed});
  fs.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);
  ougi.backup("./settings.txt", settingsChannel);
}
