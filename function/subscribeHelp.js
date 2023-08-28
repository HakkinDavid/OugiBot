module.exports =

async function (msg) {
  var embed = new Discord.EmbedBuilder()
  .setTitle("Ougi's `subscribe` command")
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setDescription("Use this command to get updates and important announcements regarding Ougi right into your DMs.")
  .setFooter({text: "helpEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi subscribe`"})
  .addFields({name: await ougi.text(msg, "output"), value: "Thanks for subscribing, " + msg.author.username + "!"})

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
