module.exports =

async function (msg) {
  var phrases = ["sike", "boo", "never gonna give you up"];
  var say = phrases[Math.floor(Math.random()*phrases.length)];
  var embed = await ougi.helpPreset(msg, "say");
  embed.setDescription(await ougi.text(msg, "sayHelpDesc"))
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi say " + say + "`"})
  .addFields({name: await ougi.text(msg, "output"), value: say});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
