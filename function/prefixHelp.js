module.exports =

async function (msg) {
  let possiblePrefix = ["spooky", "oshino", "xXOugi_YTXx", "o!", "$p00ky"];
  let embed = new Discord.EmbedBuilder()
  .setTitle("Ougi's `prefix` command")
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setFooter({text: "helpEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true");
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    embed.addFields({name: "This is only available in Discord servers.", value: ":warning: You must be in a Discord server in order to preview information about this command."})
    msg.channel.send({embeds: [embed]}).catch(console.error);
    return
  }
  embed.setDescription("Use this command to change Ougi's prefix inside your Discord server to anything you'd like.")
  .addFields({name: "Special permission required", value: ":warning: You must be the owner of whatever Discord server you run this command in."})
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi prefix " + possiblePrefix[Math.floor(Math.random()*possiblePrefix.length)] + "`"});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
