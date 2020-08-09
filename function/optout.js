module.exports =

function (msg) {
  var pseudoArray = JSON.parse(fs.readFileSync('./ignored.txt', 'utf-8', console.error));
  pseudoArray.push(msg.author.id);
  var embed = new Discord.MessageEmbed()
  .setTitle("Opt Out from Ougi")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setDescription("You've successfully opted out from using Ougi and its services. Please note whatever you do from now on will not trigger any behavior in this bot.")
  .addField("If you executed this by accident or if you ever change your mind, please send a direct message to Ougi containing the following, in order to opt in.", "`I want to start using Ougi [BOT].`")
  .setFooter("optoutEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  msg.channel.send({embed});
  var proArray = JSON.stringify(pseudoArray);
  fs.writeFile('./ignored.txt', proArray, console.error);
  var myIgnoredPPL = './ignored.txt';
  ougi.backup(myIgnoredPPL, ignoredChannel);
  client.users.cache.get("265257341967007758").send("`" + msg.author.tag + "` has requested the deletion of their data.");
}
