module.exports = async function (msg) {
  var embed = await ougi.helpPreset(msg, "pause");
  embed.setDescription(await ougi.text({ msg, stringID: "pauseHelpDesc" }))
  .addFields({ name: await ougi.text({ msg, stringID: "example" }), value: "`ougi pause`" })
  .addFields({ name: await ougi.text({ msg, stringID: "music_aliasesField" }), value: await ougi.text({ msg, stringID: "music_aliasesDesc", values: { alias1: "`ougi music pause`", alias2: "`ougi pause`" } }) });
  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
