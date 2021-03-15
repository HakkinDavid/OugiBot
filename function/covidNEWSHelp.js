module.exports =

async function (msg) {
  let embed = await ougi.helpPreset(msg, "covidnews");
  embed.setDescription((await ougi.text(msg, "covidnewsDesc")))
  .addField(await ougi.text(msg, "example"), "`ougi covidnews`");

  msg.channel.send({embed}).catch(console.error);
}
