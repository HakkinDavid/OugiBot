module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "admin-register");
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    embed.addFields({ name: await ougi.text(msg, "onlyGuilds"), value: ":warning: " + await ougi.text(msg, "mustGuild") });
  }
  embed.setDescription(await ougi.text(msg, "adminRegisterHelpDesc"))
    .addFields({
      name: await ougi.text(msg, "specialPermission"),
      value: ":warning: " + await ougi.text(msg, "mustOwnOrAdmin")
    })
    .addFields({
      name: await ougi.text(msg, "example"),
      value: "`ougi admin-register add " + msg.author.toString() + "`\n`ougi admin-register remove " + msg.author.toString() + "`"
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
