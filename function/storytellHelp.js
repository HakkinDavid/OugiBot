module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "storytell");
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    embed.addFields({ name: await ougi.text(msg, "onlyGuilds"), value: ":warning: " + await ougi.text(msg, "mustGuild") });
  }
  embed.setDescription(await ougi.text(msg, "storytellHelpDesc"))
    .addFields({
      name: await ougi.text(msg, "example"),
      value: "`ougi storytell`"
    })
    .addFields({
      name: await ougi.text(msg, "output"),
      value: await ougi.text(msg, "storytell_output")
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
