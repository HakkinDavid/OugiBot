module.exports =

async function (msg) {
  var embed = new Discord.EmbedBuilder()
  .setTitle("Ougi's `unsubscribe` command")
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setDescription("Use this command to stop receiving updates and important announcements regarding Ougi.")
  .setFooter({text: "helpEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi unsubscribe`"})
  .addFields({name: await ougi.text(msg, "output"), value: "You've successfully unsubscribed Ougi's announcements."})

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
