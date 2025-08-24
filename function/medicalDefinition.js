module.exports =

async function (arguments, msg) {
  let availableDefinitions = ["covid-19", "coronavirus", "pandemic", "face mask", "quarantine", "safe distance", "symptoms"];
  let translatedConcepts = [];
  for (i=0; i < availableDefinitions.length; i++) {
    translatedConcepts.push(await ougi.text(msg, availableDefinitions[i]));
  }
  let similar = stringSimilarity.findBestMatch(arguments.join(" "), translatedConcepts).bestMatch.target;
  let definitionNum = translatedConcepts.indexOf(similar);
  let medDef = await ougi.text(msg, "md" + (definitionNum + 1));
  let embed = new Discord.EmbedBuilder()
  .setTitle((await ougi.text(msg, "mdThis")).replace(/{m}/gi, translatedConcepts[definitionNum]))
  .setDescription(medDef)
  .addFields({name: "\u200b", value: "[" + await ougi.text(msg, "WHOCOVID19ADVICE") + "](https://www.who.int/)"})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/health.png?raw=true")
  .setColor(["#03FC66", "#03FCBA", "#F0466D", "#FA7FE5", "#7F8CFA"][Math.floor(Math.random()*5)])
  .setFooter({text: "medicalDefinition brought to you by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setTimestamp();
  msg.channel.send({embeds: [embed]});
}
