module.exports =

async function (msg) {
  let options = ["yes", "no", "yeah", "nah", "maybe", "maybeNot", "guess", "guessNot", "idk", "notSure", "askSomeone", "negative", "squareNegative", "pancakes", "impossible", "notWhoKnows", "skipQuestion", "uh"];
  let response = await ougi.text(msg, options[Math.floor(Math.random()*options.length)]);
  var phrases = ["questionA", "questionB", "questionC"];
  var question = await ougi.text(msg, phrases[Math.floor(Math.random()*phrases.length)]);
  let embed = await ougi.helpPreset(msg, "answer");
  embed.setDescription(await ougi.text(msg, "answerHelpDesc"))
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi answer " + question + "`"})
  .addFields({name: await ougi.text(msg, "output"), value: response});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
