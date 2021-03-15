module.exports =

async function (msg) {
  let embed = await ougi.helpPreset(msg, "healthcare");
  embed.setDescription((await ougi.text(msg, "healthcareDesc")))
  .addField(await ougi.text(msg, "example"), "`ougi healthcare`");

  msg.channel.send({embed}).catch(console.error);
}
