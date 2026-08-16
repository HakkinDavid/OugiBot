module.exports =

async function (msg) {
  if (!(await ougi.guildCheck(msg))) return;
  let embed = await ougi.helpPreset(msg, "remindbump");
  embed.setDescription(await ougi.text({ msg, stringID: "remindbumpHelpDesc" }))
  .addFields({ name: await ougi.text({ msg, stringID: "specialPermission" }), value: ":warning: " + await ougi.text({ msg, stringID: "onlyOwner" }) })
  .addFields({name: await ougi.text({ msg, stringID: "example" }), value: "`ougi remindbump `" + msg.channel.toString() + "` @role `"})
  .addFields({name: await ougi.text({ msg, stringID: "output" }), value: await ougi.text({ msg, stringID: "remindbump_output", values: { channel: msg.channel.toString() } })})
  .addFields({name: await ougi.text({ msg, stringID: "remindbump_disableField" }), value: "`ougi remindbump disable`"})
  .addFields({name: await ougi.text({ msg, stringID: "output" }), value: await ougi.text({ msg, stringID: "remindbump_disableOutput" })});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
