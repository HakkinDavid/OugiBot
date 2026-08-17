module.exports = async function (msg) {
  var embed = await ougi.helpPreset(msg, "np");
  embed.setDescription(await ougi.text({ msg, stringID: "npHelpDesc" }))
  .addFields({ name: await ougi.text({ msg, stringID: "example" }), value: "`ougi np`" })
  .addFields({ name: await ougi.text({ msg, stringID: "music_aliasesField" }), value: await ougi.text({ msg, stringID: "music_aliasesDesc", values: { alias1: "`ougi nowplaying`", alias2: "`ougi music np`" } }) });
  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
