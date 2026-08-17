module.exports = async function (msg) {
  var embed = await ougi.helpPreset(msg, "resume");
  embed.setDescription(await ougi.text({ msg, stringID: "resumeHelpDesc" }))
  .addFields({ name: await ougi.text({ msg, stringID: "example" }), value: "`ougi resume`" })
  .addFields({ name: await ougi.text({ msg, stringID: "music_aliasesField" }), value: await ougi.text({ msg, stringID: "music_aliasesDesc", values: { alias1: "`ougi unpause`", alias2: "`ougi music resume`" } }) });
  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
