module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "leaderboard");
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    embed.addFields({ name: await ougi.text({ msg, stringID: "onlyGuilds" }), value: ":warning: " + await ougi.text({ msg, stringID: "mustGuild" }) });
  }
  embed.setDescription(await ougi.text({ msg, stringID: "leaderboardHelpDesc" }))
    .addFields({
      name: await ougi.text({ msg, stringID: "example" }),
      value: "`ougi leaderboard`"
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
