module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "xp-channel");
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    embed.addFields({ name: await ougi.text(msg, "onlyGuilds"), value: ":warning: " + await ougi.text(msg, "mustGuild") });
  }
  embed.setDescription(await ougi.text(msg, "xpChannelHelpDesc"))
    .addFields({
      name: await ougi.text(msg, "specialPermission"),
      value: ":warning: " + await ougi.text(msg, "mustOwnOrAdmin")
    })
    .addFields({
      name: await ougi.text(msg, "example"),
      value: "`ougi xp-channel add " + msg.channel.toString() + "`\n`ougi xp-channel remove all`"
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
