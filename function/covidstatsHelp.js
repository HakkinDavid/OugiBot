module.exports =

  async function (msg) {
    let countriesArray = ["mx", "us", "uk", "puerto rico", "argentina", "mexico", "nicaragua", "cuba", "gb", "brazil", "br", "ar"];
    let embed = await ougi.helpPreset(msg, "covidstats");
    embed.setDescription((await ougi.text(msg, "covidStatsDesc")))
      .addFields({ name: await ougi.text(msg, "example"), value: "`ougi covidstats " + countriesArray[Math.floor(Math.random() * countriesArray.length)] + "`" });

    msg.channel.send({ embeds: [embed] }).catch(console.error);
  }
