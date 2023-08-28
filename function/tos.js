module.exports =

async function (msg) {
  var embed = new Discord.EmbedBuilder()
  .setTitle("Ougi's data usage acknowledgement")
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setDescription("By using Ougi, you acknowledge and accept the following.")
  .setFooter({text: "acknowledgementEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .addFields({name: "Contact for technical support, suggestions, feedback and requests", value: "Ougi's developer: `" + client.users.cache.get(davidUserID).username + "`.\nOugi's main Discord server: https://discord.gg/nB3GXW5"})
  .addFields({name: "Commands logging", value: "For debugging purposes, commands, arguments and executant are stored in Ougi's console logs. This information is only visible to Ougi's developer."})
  .addFields({name: "Language processing events", value: "In order to provide a seamless immersive Artificial Intelligence experience, anything you teach to Ougi through `learn` command is permanently stored and available for anyone. Use the contact information to request the deletion of a specific trigger."})
  .addFields({name: "Message deletions for `snipe` command", value: "Under the deletion of a message within a channel Ougi has access to, the deleted message is **temporarily** stored in the bot's instance (just so `snipe` command can be used!) and it's not visible to anyone. Feel free to disable this on your guild by executing `ougi remove snipe`."})
  .addFields({name: "Per-user opt out from Ougi services", value: "If you don't agree with this data usage acknowledgement, you can opt out from everything regarding Ougi. Opt out by sending a direct message to " + client.user.toString() + " containing the following: `I want to opt out from using Ougi [BOT].`"})
  .addFields({name: "Once you opt out...", value: "Ougi won't process any input from you, and will send a notice to our team so we delete any remaining of your data in Ougi's database."})
  .addFields({name: "Detailed Privacy Policy at", value: "https://github.com/HakkinDavid/OugiBot/blob/1e510275c395a691181e8ec18fcb39263d7cc2db/docs/Ougi%20BOT%20Privacy%20Policy.pdf"})
  msg.channel.send({embeds: [embed]}).catch(console.error);
}
