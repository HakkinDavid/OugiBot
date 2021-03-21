module.exports =

async function (msg) {
  let countriesArray = ["mx", "us", "uk", "puerto rico", "argentina", "mexico", "nicaragua", "cuba", "gb", "brazil", "br", "ar"];
  let embed = await ougi.helpPreset(msg, "covidstats");
  embed.setDescription((await ougi.text(msg, "covidStatsDesc")))
  .addField(await ougi.text(msg, "example"), "`ougi covidstats " + countriesArray[Math.floor(Math.random()*countriesArray.length)] +"`");

  msg.channel.send({embed}).catch(console.error);
}
