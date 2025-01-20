module.exports =

async function (msg) {
  let embed = new Discord.EmbedBuilder()
  .setTitle("Ougi's `remindbump` command")
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setFooter({text: "helpEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true");
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    embed.addFields({name: "This is only available in Discord servers.", value: ":warning: You must be in a Discord server in order to preview information about this command."})
    msg.channel.send({embeds: [embed]}).catch(console.error);
    return
  }
  embed.setDescription("Use this command to set a channel to remind users to bump this Discord server. If no channel is mentioned, Ougi will use the channel you run the command in. You may as well specify a role to ping!")
  .addFields({name: "Special permission required", value: ":warning: You must be the owner of whatever Discord server you run this command in."})
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi remindbump `" + msg.channel.toString() + "` @role `"})
  .addFields({name: await ougi.text(msg, "output"), value: "I'll remind @role to bump in " + msg.channel.toString() + "."})
  .addFields({name: "You may also disable this function", value: "`ougi remindbump disable`"})
  .addFields({name: await ougi.text(msg, "output"), value: "Bump reminder channel successfully disabled."})

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
