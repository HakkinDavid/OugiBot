module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "gamble");
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    embed.addFields({ name: await ougi.text(msg, "onlyGuilds"), value: ":warning: " + await ougi.text(msg, "mustGuild") });
  }
  embed.setDescription(await ougi.text(msg, "gambleHelpDesc"))
    .addFields({
      name: await ougi.text(msg, "example"),
      value: "`ougi gamble 100`"
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
