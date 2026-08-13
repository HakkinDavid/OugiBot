module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "balance");
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    embed.addFields({ name: await ougi.text(msg, "onlyGuilds"), value: ":warning: " + await ougi.text(msg, "mustGuild") });
  }
  embed.setDescription(await ougi.text(msg, "balanceHelpDesc"))
    .addFields({
      name: await ougi.text(msg, "example"),
      value: "`ougi balance`\n`ougi bal " + msg.author.toString() + "`"
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
