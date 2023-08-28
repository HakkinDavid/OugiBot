module.exports =

async function (msg) {
  let callerID = msg.author.id;
  if (settingsOBJ.subscribers.includes(callerID)) {
    msg.channel.send("Beep boop. You were already subscribed!");
    return
  }
  settingsOBJ.subscribers.push(callerID);
  await ougi.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);
  let embed = new Discord.EmbedBuilder()
  .setTitle("Thanks for subscribing, " + client.users.cache.get(callerID).username + "!")
  .setColor("#000000")
  .setDescription("I'll let you know when there's any important announcements or an update.")
  .setFooter({text: "subscribersEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail(client.users.cache.get(callerID).avatarURL({dynamic: true, size: 4096}))
  .setImage("https://github.com/HakkinDavid/OugiBot/blob/master/images/veryepic.png?raw=true");
  let subscribeNotificationEmbed = new Discord.EmbedBuilder()
  .setTitle(client.users.cache.get(callerID).username + " has subscribed!")
  .setDescription("I gave them some chocolate :chocolate_bar: because they are epic. This is so exciting, have some too!")
  .setColor("#000000")
  .setFooter({text: "subscribeNotificationEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail(client.users.cache.get(callerID).avatarURL({dynamic: true, size: 4096}))
  .setImage("https://github.com/HakkinDavid/OugiBot/blob/master/images/veryepic.png?raw=true");
  client.users.cache.get(callerID).send("__**Do you want to follow Ougi's development more closely?**__\nFeel free to join " + client.users.cache.get(davidUserID).username +" (Ougi's developer) in his personal Discord server.\nhttps://discord.gg/nB3GXW5\n*This is an optional step.*", {embeds: [embed]}).then(()=> {client.users.cache.get(davidUserID).send({embeds: [subscribeNotificationEmbed]}).catch(console.error)}).catch(console.error);
  if (msg.channel.type !== Discord.ChannelType.DM) {
    msg.channel.send("Check your DMs ;)").catch(console.error);
  }
  await ougi.backup("./settings.txt", settingsChannel);
}
