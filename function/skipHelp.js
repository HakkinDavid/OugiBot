module.exports =

async function (msg) {
  var embed = await ougi.helpPreset(msg, "skip");
  embed.setDescription(await ougi.text({ msg, stringID: "skipHelpDesc" }))
  .addFields({name: await ougi.text({ msg, stringID: "example" }), value: "`ougi skip`"})
  .addFields({name: await ougi.text({ msg, stringID: "output" }), value: await ougi.text({ msg, stringID: "musicSkipped" })});
  msg.channel.send({embeds: [embed]}).catch(console.error);
}
