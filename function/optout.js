module.exports =

async function (msg) {
  settingsOBJ.ignored.push(msg.author.id);
  let embed = new Discord.EmbedBuilder()
  .setTitle("Opt Out from Ougi")
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setDescription("You've successfully opted out from using Ougi and its services. Please note whatever you do from now on will not trigger any behavior in this bot.")
  .addFields({name: "If you executed this by accident or if you ever change your mind, please send a direct message to Ougi containing the following, in order to opt in.", value: "`I want to start using Ougi [BOT].`"})
  .setFooter({text: "optoutEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  msg.channel.send({embeds: [embed]});
  await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
  await ougi.backup("./settings.txt", settingsChannel);
  client.users.cache.get(davidUserID).send("`" + msg.author.username + "` has requested the deletion of their data.");
}
