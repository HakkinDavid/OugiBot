module.exports =

function (msg) {
  let pseudoArray = JSON.parse(fs.readFileSync('./settings.txt', 'utf-8', console.error));
  pseudoArray.ignored.push(msg.author.id);
  let embed = new Discord.MessageEmbed()
  .setTitle("Opt Out from Ougi")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setDescription("You've successfully opted out from using Ougi and its services. Please note whatever you do from now on will not trigger any behavior in this bot.")
  .addField("If you executed this by accident or if you ever change your mind, please send a direct message to Ougi containing the following, in order to opt in.", "`I want to start using Ougi [BOT].`")
  .setFooter("optoutEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  msg.channel.send({embed});
  let proArray = JSON.stringify(pseudoArray);
  fs.writeFile('./settings.txt', proArray, console.error);
  let myIgnoredPPL = './settings.txt';
  ougi.backup(myIgnoredPPL, settingsChannel);
  client.users.cache.get("265257341967007758").send("`" + msg.author.tag + "` has requested the deletion of their data.");
}
