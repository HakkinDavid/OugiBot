module.exports = async function (msg) {
  var embed = await ougi.helpPreset(msg, "stop");
  embed.setDescription(await ougi.text({ msg, stringID: "stopHelpDesc" }))
  .addFields({ name: await ougi.text({ msg, stringID: "example" }), value: "`ougi stop`" })
  .addFields({ name: await ougi.text({ msg, stringID: "music_aliasesField" }), value: await ougi.text({ msg, stringID: "music_aliasesDesc", values: { alias1: "`ougi music stop`", alias2: "`ougi stop`" } }) });
  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
