module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "raffle-execute");
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    embed.addFields({ name: await ougi.text(msg, "onlyGuilds"), value: ":warning: " + await ougi.text(msg, "mustGuild") });
  }
  embed.setDescription(await ougi.text(msg, "raffleExecuteHelpDesc"))
    .addFields({ name: await ougi.text(msg, "specialPermission"), value: ":warning: " + await ougi.text(msg, "onlyOwner") })
    .addFields({ name: await ougi.text(msg, "example"), value: "Reply to the ongoing raffle message with:\n`ougi raffle-execute`" });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
