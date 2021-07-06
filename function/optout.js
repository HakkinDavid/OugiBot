module.exports =

async function (msg) {
  settingsOBJ.ignored.push(msg.author.id);
  let embed = new Discord.MessageEmbed()
  .setTitle("Opt Out from Ougi")
  .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
  .setColor("#230347")
  .setDescription("You've successfully opted out from using Ougi and its services. Please note whatever you do from now on will not trigger any behavior in this bot.")
  .addField("If you executed this by accident or if you ever change your mind, please send a direct message to Ougi containing the following, in order to opt in.", "`I want to start using Ougi [BOT].`")
  .setFooter("optoutEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  msg.channel.send({embed});
  fs.writeFile('./settings.txt', JSON.stringify(settingsOBJ), console.error);
  ougi.backup("./settings.txt", settingsChannel);
  client.users.cache.get("265257341967007758").send("`" + msg.author.tag + "` has requested the deletion of their data.");
}
