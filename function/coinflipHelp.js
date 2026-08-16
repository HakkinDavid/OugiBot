module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "coinflip");
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    embed.addFields({ name: await ougi.text({ msg, stringID: "onlyGuilds" }), value: ":warning: " + await ougi.text({ msg, stringID: "mustGuild" }) });
  }
  embed.setDescription(await ougi.text({ msg, stringID: "coinflipHelpDesc" }))
    .addFields({
      name: await ougi.text({ msg, stringID: "example" }),
      value: "`ougi coinflip 50 heads`\n`ougi coinflip 100 tails`"
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
