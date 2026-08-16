module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "seticon");
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    embed.addFields({ name: await ougi.text({ msg, stringID: "onlyGuilds" }), value: ":warning: " + await ougi.text({ msg, stringID: "mustGuild" }) });
  }
  embed.setDescription(await ougi.text({ msg, stringID: "seticonHelpDesc" }))
    .addFields({
      name: await ougi.text({ msg, stringID: "specialPermission" }),
      value: ":warning: " + await ougi.text({ msg, stringID: "mustOwnOrAdmin" })
    })
    .addFields({
      name: await ougi.text({ msg, stringID: "example" }),
      value: "`ougi seticon currency 🪙`\n`ougi seticon xp EXP`"
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
