module.exports =

async function (msg) {
  let embed = new Discord.EmbedBuilder()
  .setTitle("Ougi's `setlog` command")
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setFooter({text: "helpEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true");
  if (msg.channel.type != "text") {
    embed.addFields({name: "This is only available in Discord servers.", value: ":warning: You must be in a Discord server in order to preview information about this command."})
    msg.channel.send({embeds: [embed]}).catch(console.error);
    return
  }
  embed.setDescription("Use this command to set a channel to log whatever Ougi is used for in this Discord server. If no channel is mentioned, Ougi will use the channel you run the command in.")
  .addFields({name: "Special permission required", value: ":warning: You must be the owner of whatever Discord server you run this command in."})
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi setlog `" + msg.channel.toString() + "` `"})
  .addFields({name: await ougi.text(msg, "output"), value: "I'll start sending this server's commands log into " + msg.channel.toString() + "."})
  .addFields({name: "You may also disable this function", value: "`ougi setlog disable`"})
  .addFields({name: await ougi.text(msg, "output"), value: "Logging channel successfully disabled."})

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
