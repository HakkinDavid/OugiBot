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
      value: "Starts a 5-minute interactive story collector in the channel where participants earn rewards or take penalties based on Ougi's evaluation."
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
