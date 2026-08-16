module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "storytell");
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    embed.addFields({ name: await ougi.text({ msg, stringID: "onlyGuilds" }), value: ":warning: " + await ougi.text({ msg, stringID: "mustGuild" }) });
  }
  embed.setDescription(await ougi.text({ msg, stringID: "storytellHelpDesc" }))
    .addFields({
      name: await ougi.text({ msg, stringID: "example" }),
      value: "`ougi storytell`"
    })
    .addFields({
      name: await ougi.text({ msg, stringID: "output" }),
      value: await ougi.text({ msg, stringID: "storytell_output" })
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
