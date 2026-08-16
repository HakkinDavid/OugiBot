module.exports =

async function (msg) {
  var embed = await ougi.helpPreset(msg, "unsubscribe");
  embed.setDescription(await ougi.text({ msg, stringID: "unsubscribeHelpDesc" }))
  .addFields({name: await ougi.text({ msg, stringID: "example" }), value: "`ougi unsubscribe`"})
  .addFields({name: await ougi.text({ msg, stringID: "output" }), value: await ougi.text({ msg, stringID: "unsubscribe_helpOutput" })});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
