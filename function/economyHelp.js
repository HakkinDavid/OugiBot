module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "economy");
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    embed.addFields({ name: await ougi.text(msg, "onlyGuilds"), value: ":warning: " + await ougi.text(msg, "mustGuild") });
  }
  embed.setDescription(await ougi.text(msg, "economyHelpDesc"))
    .addFields({
      name: await ougi.text(msg, "specialPermission"),
      value: ":warning: " + await ougi.text(msg, "mustOwnOrAdmin")
    })
    .addFields({
      name: await ougi.text(msg, "example"),
      value: "`ougi economy enable`\n`ougi economy disable`\n`ougi economy reset`\n`ougi economy cooldown 30`"
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
