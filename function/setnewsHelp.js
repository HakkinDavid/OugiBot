module.exports =

async function (msg) {
  if (!(await ougi.guildCheck(msg))) return;
  let embed = await ougi.helpPreset(msg, "setnews");
  embed.setDescription(await ougi.text({ msg, stringID: "setnewsHelpDesc" }))
  .addFields({name: await ougi.text({ msg, stringID: "specialPermission" }), value: ":warning: " + await ougi.text({ msg, stringID: "onlyOwner" })})
  .addFields({name: await ougi.text({ msg, stringID: "example" }), value: "`ougi setnews `" + msg.channel.toString() + "` `"})
  .addFields({name: await ougi.text({ msg, stringID: "output" }), value: await ougi.text({ msg, stringID: "setnews_output", values: { channel: msg.channel.toString() } })})
  .addFields({name: await ougi.text({ msg, stringID: "setnews_disableField" }), value: "`ougi setnews disable`"})
  .addFields({name: await ougi.text({ msg, stringID: "output" }), value: await ougi.text({ msg, stringID: "setnews_disableOutput" })});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
