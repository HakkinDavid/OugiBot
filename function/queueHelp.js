module.exports = async function (msg) {
  var embed = await ougi.helpPreset(msg, "queue");
  embed.setDescription(await ougi.text({ msg, stringID: "queueHelpDesc" }))
  .addFields({ name: await ougi.text({ msg, stringID: "example" }), value: "`ougi queue`" })
  .addFields({ name: await ougi.text({ msg, stringID: "music_aliasesField" }), value: await ougi.text({ msg, stringID: "music_aliasesDesc", values: { alias1: "`ougi q`", alias2: "`ougi music queue`" } }) });
  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
