module.exports =

function (msg) {
  let pseudoArray = JSON.parse(fs.readFileSync('./settings.txt', 'utf-8', console.error));
  let index = pseudoArray.ignored.indexOf(msg.author.id);
  pseudoArray.splice(index);
  let embed = new Discord.MessageEmbed()
  .setTitle("Opt In to Ougi")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setDescription("You've successfully opted in to use Ougi and its services.")
  .setFooter("optoutEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  msg.channel.send({embed});
  let proArray = JSON.stringify(pseudoArray);
  fs.writeFile('./settings.txt', proArray, console.error);
  let myIgnoredPPL = './settings.txt';
  ougi.backup(myIgnoredPPL, settingsChannel);
}
