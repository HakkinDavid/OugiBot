module.exports = async function (msg) {
  var embed = await ougi.helpPreset(msg, "remove");
  embed.setDescription(await ougi.text({ msg, stringID: "musicRemoveHelpDesc" }))
  .addFields({ name: await ougi.text({ msg, stringID: "example" }), value: "`ougi remove 2`\n`ougi remove renai circulation`" })
  .addFields({ name: await ougi.text({ msg, stringID: "music_aliasesField" }), value: await ougi.text({ msg, stringID: "music_aliasesDesc", values: { alias1: "`ougi dequeue`", alias2: "`ougi music remove`" } }) });
  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
