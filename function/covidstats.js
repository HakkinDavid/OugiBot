module.exports =

async function (arguments, msg) {
  let countryName = arguments.join(" ");
  switch (countryName) {
    case "united states":
      countryName = "us"
    break;
    case "united kingdom":
      countryName = "gb"
    break;
    case "united states of america":
      countryName = "us"
    break;
    case "uk":
      countryName = "gb"
    break;
  }
  let covidFetchSettings = {
    name: countryName
  };
  let isCode = "";
  if (countryName.length == 2) {
    covidFetchSettings = {
      code: countryName
    };
    isCode = "/code"
  }
  let options = {
    method: 'GET',
    url: 'https://covid-19-data.p.rapidapi.com/country' + isCode,
    qs: covidFetchSettings,
    headers: {
    'x-rapidapi-key': process.env.RAPIDAPI,
    'x-rapidapi-host': 'covid-19-data.p.rapidapi.com',
    useQueryString: true
    }
  };

  let allStats;

  await request(options, async function (error, response, body) {
	   if (body.length <= 2) {
       let sorryNotACountry = await ougi.text(msg, "notCountry");
       msg.channel.send(sorryNotACountry);
       return
     }

     let allStats = JSON.parse(body.slice(1,-1));

     let embed = new Discord.MessageEmbed()
     .setTitle(await ougi.text(msg, "covidStatsTitle"))
     .setDescription(allStats.country + " (" + allStats.code + ") :flag_" + allStats.code.toLowerCase() + ":")
     .addField(await ougi.text(msg, "covidStatsConfirmed"), allStats.confirmed)
     .addField(await ougi.text(msg, "covidStatsCritical"), allStats.critical)
     .addField(await ougi.text(msg, "covidStatsDeaths"), allStats.deaths)
     .addField(await ougi.text(msg, "covidStatsRecovered"), allStats.recovered)
     .addField("\u200b", "[" + await ougi.text(msg, "WHOCOVID19ADVICE") + "](https://www.who.int/)")
     .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/health.png?raw=true")
     .setColor(["#03FC66", "#03FCBA", "#F0466D", "#FA7FE5", "#7F8CFA"][Math.floor(Math.random()*5)])
     .setFooter("COVID-19 Statistics brought to you by Ougi, through COVID-19 data API (sources: Johns Hopkins CSSE, CDC, WHO)", client.user.avatarURL())
     .setTimestamp();
     msg.channel.send(embed);
    }
  );
}
