module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "admin-register");
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    embed.addFields({ name: await ougi.text({ msg, stringID: "onlyGuilds" }), value: ":warning: " + await ougi.text({ msg, stringID: "mustGuild" }) });
  }
  embed.setDescription(await ougi.text({ msg, stringID: "adminRegisterHelpDesc" }))
    .addFields({
      name: await ougi.text({ msg, stringID: "specialPermission" }),
      value: ":warning: " + await ougi.text({ msg, stringID: "mustOwnOrAdmin" })
    })
    .addFields({
      name: await ougi.text({ msg, stringID: "example" }),
      value: "`ougi admin-register add " + msg.author.toString() + "`\n`ougi admin-register remove " + msg.author.toString() + "`"
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
