module.exports =

async function (msg) {
  let embed = await ougi.helpPreset(msg, "survey");
  embed.setDescription(await ougi.text(msg, "surveyHelpDesc"))
  .addField(await ougi.text(msg, "example"), "`ougi survey`");

  msg.channel.send(embed).catch(console.error);
}
