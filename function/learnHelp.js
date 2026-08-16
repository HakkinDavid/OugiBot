module.exports =

async function (msg) {
  var phrases = ["johnny", "foo", "never gonna give, never gonna give"];
  var matchingreply = ["test", "bar", "(give you up)"];
  var trigger = phrases[Math.floor(Math.random()*phrases.length)];
  var response = matchingreply[phrases.indexOf(trigger)];
  var success1 = (await ougi.text(msg, "learn_success1")).replace(/{response}/g, response).replace(/{trigger}/g, trigger);
  var success2 = (await ougi.text(msg, "learn_success2")).replace(/{response}/g, response).replace(/{trigger}/g, trigger);
  var afterOptions = [
    success1,
    success2
  ];
  var answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];
  var embed = await ougi.helpPreset(msg, "learn");
  embed.setDescription(await ougi.text(msg, "learnHelpDesc"))
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi learn " + trigger + " :: " + response + "`"})
  .addFields({name: await ougi.text(msg, "output"), value: answer})
  .addFields({name: "Note", value: await ougi.text(msg, "learn_note")})
  .addFields({name: await ougi.text(msg, "learn_usingTrigger"), value: "`ougi " + trigger + "`"})
  .addFields({name: await ougi.text(msg, "learn_ougiWillReply"), value: response})
  .addFields({name: await ougi.text(msg, "learn_tryingForget"), value: "`ougi help forget`"});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
