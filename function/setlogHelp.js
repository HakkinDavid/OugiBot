module.exports =

async function (msg) {
  if (!(await ougi.guildCheck(msg))) return;
  let embed = await ougi.helpPreset(msg, "setlog");
  embed.setDescription(await ougi.text({ msg, stringID: "setlogHelpDesc" }))
  .addFields({name: await ougi.text({ msg, stringID: "specialPermission" }), value: ":warning: " + await ougi.text({ msg, stringID: "onlyOwner" })})
  .addFields({name: await ougi.text({ msg, stringID: "example" }), value: "`ougi setlog `" + msg.channel.toString() + "` `"})
  .addFields({name: await ougi.text({ msg, stringID: "output" }), value: await ougi.text({ msg, stringID: "setlog_output", values: { channel: msg.channel.toString() } })})
  .addFields({name: await ougi.text({ msg, stringID: "setlog_disableField" }), value: "`ougi setlog disable`"})
  .addFields({name: await ougi.text({ msg, stringID: "output" }), value: await ougi.text({ msg, stringID: "setlog_disableOutput" })});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
