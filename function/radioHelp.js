module.exports = async function (msg) {
  var embed = await ougi.helpPreset(msg, "radio");
  embed.setDescription(await ougi.text({ msg, stringID: "radioHelpDesc" }))
  .addFields({ name: await ougi.text({ msg, stringID: "example" }), value: "`ougi radio`" })
  .addFields({ name: await ougi.text({ msg, stringID: "music_aliasesField" }), value: await ougi.text({ msg, stringID: "music_aliasesDesc", values: { alias1: "`ougi live`", alias2: "`ougi music radio`" } }) });
  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
