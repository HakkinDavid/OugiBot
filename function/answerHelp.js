module.exports =

async function (msg) {
  let options = [await ougi.text(msg, "yes"), await ougi.text(msg, "no"), await ougi.text(msg, "yeah"), await ougi.text(msg, "nah"), await ougi.text(msg, "maybe"), await ougi.text(msg, "maybeNot"), await ougi.text(msg, "guess"), await ougi.text(msg, "guessNot"), await ougi.text(msg, "idk"), await ougi.text(msg, "notSure"), await ougi.text(msg, "askSomeone"), await ougi.text(msg, "negative"), await ougi.text(msg, "squareNegative"), await ougi.text(msg, "pancakes"), "**" + await ougi.text(msg, "impossible") + "**", await ougi.text(msg, "notWhoKnows"), await ougi.text(msg, "skipQuestion"), await ougi.text(msg, "uh")];
  let response = options[Math.floor(Math.random()*options.length)];
  var phrases = [await ougi.text(msg, "questionA"), await ougi.text(msg, "questionB"), await ougi.text(msg, "questionC")];
  var question = phrases[Math.floor(Math.random()*phrases.length)];
  let embed = await ougi.helpPreset(msg, "answer");
  embed.setDescription(await ougi.text(msg, "answerHelpDesc"))
  .addField(await ougi.text(msg, "example"), "`ougi answer " + question + "`")
  .addField(await ougi.text(msg, "output"), response);

  msg.channel.send({embed}).catch(console.error);
}
