module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "slots");
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    embed.addFields({ name: await ougi.text({ msg, stringID: "onlyGuilds" }), value: ":warning: " + await ougi.text({ msg, stringID: "mustGuild" }) });
  }
  embed.setDescription(await ougi.text({ msg, stringID: "slotsHelpDesc" }))
    .addFields({
      name: await ougi.text({ msg, stringID: "example" }),
      value: "`ougi slots 50`"
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
