module.exports =

function (msg) {
  var pseudoArray = JSON.parse(fs.readFileSync('./ignored.txt', 'utf-8', console.error));
  let index = pseudoArray.indexOf(msg.author.id);
  pseudoArray.splice(index);
  var embed = new Discord.RichEmbed()
  .setTitle("Opt In to Ougi")
  .setAuthor("Ougi [BOT]", client.user.avatarURL)
  .setColor("#230347")
  .setDescription("You've successfully opted in to use Ougi and its services.")
  .setFooter("optoutEmbed by Ougi", client.user.avatarURL)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  msg.channel.send({embed});
  var proArray = JSON.stringify(pseudoArray);
  fs.writeFile('./ignored.txt', proArray, console.error);
  var myIgnoredPPL = './ignored.txt';
  ougi.backup(myIgnoredPPL, ignoredChannel);
}
