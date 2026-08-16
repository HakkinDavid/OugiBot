module.exports =

async function (msg) {
  var phrases = ["johnny", "foo", "never gonna give, never gonna give"];
  var matchingreply = ["test", "bar", "(give you up)"];
  var trigger = phrases[Math.floor(Math.random()*phrases.length)];
  var response = matchingreply[phrases.indexOf(trigger)];
  var success1 = (await ougi.text(msg, "forget_success1")).replace(/{response}/g, response).replace(/{trigger}/g, trigger);
  var success2 = (await ougi.text(msg, "forget_success2")).replace(/{response}/g, response).replace(/{trigger}/g, trigger);
  var afterOptions = [
    success1,
    success2
  ];
  var answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];
  var embed = await ougi.helpPreset(msg, "forget");
  embed.setDescription(await ougi.text(msg, "forgetHelpDesc"))
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi forget " + trigger + " :: " + response + "`"})
  .addFields({name: await ougi.text(msg, "output"), value: answer});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
