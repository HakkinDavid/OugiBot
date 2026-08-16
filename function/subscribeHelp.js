module.exports =

async function (msg) {
  var embed = await ougi.helpPreset(msg, "subscribe");
  var outputText = await ougi.text({
    msg,
    stringID: "subscribe_helpOutput",
    values: {
      user: msg.author.username
    }
  });
  embed.setDescription(await ougi.text({ msg, stringID: "subscribeHelpDesc" }))
  .addFields({name: await ougi.text({ msg, stringID: "example" }), value: "`ougi subscribe`"})
  .addFields({name: await ougi.text({ msg, stringID: "output" }), value: outputText});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
