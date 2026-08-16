module.exports =

async function (msg) {
  var phrases = ["johnny", "foo", "never gonna give, never gonna give"];
  var matchingreply = ["test", "bar", "(give you up)"];
  var trigger = phrases[Math.floor(Math.random()*phrases.length)];
  var response = matchingreply[phrases.indexOf(trigger)];
  var chosenKey = ["forget_success1", "forget_success2"][Math.floor(Math.random() * 2)];
  var answer = await ougi.text({
    msg,
    stringID: chosenKey,
    values: {
      response,
      trigger
    }
  });
  var embed = await ougi.helpPreset(msg, "forget");
  embed.setDescription(await ougi.text({ msg, stringID: "forgetHelpDesc", values: { separator: "::" } }))
  .addFields({name: await ougi.text({ msg, stringID: "example" }), value: "`ougi forget " + trigger + " :: " + response + "`"})
  .addFields({name: await ougi.text({ msg, stringID: "output" }), value: answer});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
