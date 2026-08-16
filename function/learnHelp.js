module.exports =

async function (msg) {
  var phrases = ["johnny", "foo", "never gonna give, never gonna give"];
  var matchingreply = ["test", "bar", "(give you up)"];
  var trigger = phrases[Math.floor(Math.random()*phrases.length)];
  var response = matchingreply[phrases.indexOf(trigger)];
  var success1 = await ougi.text({ msg, stringID: "learn_success1", values: { response, trigger } });
  var success2 = await ougi.text({ msg, stringID: "learn_success2", values: { response, trigger } });
  var afterOptions = [
    success1,
    success2
  ];
  var answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];
  var embed = await ougi.helpPreset(msg, "learn");
  embed.setDescription(await ougi.text({ msg, stringID: "learnHelpDesc" }))
  .addFields({name: await ougi.text({ msg, stringID: "example" }), value: "`ougi learn " + trigger + " :: " + response + "`"})
  .addFields({name: await ougi.text({ msg, stringID: "output" }), value: answer})
  .addFields({name: "Note", value: await ougi.text({ msg, stringID: "learn_note" })})
  .addFields({name: await ougi.text({ msg, stringID: "learn_usingTrigger" }), value: "`ougi " + trigger + "`"})
  .addFields({name: await ougi.text({ msg, stringID: "learn_ougiWillReply" }), value: response})
  .addFields({name: await ougi.text({ msg, stringID: "learn_tryingForget" }), value: "`ougi help forget`"});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
