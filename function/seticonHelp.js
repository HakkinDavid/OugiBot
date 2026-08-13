module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "seticon");
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    embed.addFields({ name: await ougi.text(msg, "onlyGuilds"), value: ":warning: " + await ougi.text(msg, "mustGuild") });
  }
  embed.setDescription(await ougi.text(msg, "seticonHelpDesc"))
    .addFields({
      name: await ougi.text(msg, "specialPermission"),
      value: ":warning: " + await ougi.text(msg, "mustOwnOrAdmin")
    })
    .addFields({
      name: await ougi.text(msg, "example"),
      value: "`ougi seticon currency 🪙`\n`ougi seticon xp EXP`"
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
