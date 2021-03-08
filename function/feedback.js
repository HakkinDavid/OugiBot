module.exports =

async function (msg, intentional) {
  if (!intentional && msg.content.toLowerCase().startsWith("ougi survey")) {
    return
  }
  let gamble = Math.floor(Math.random()*3);
  if (gamble < 1 && !intentional) {
    return
  }
  let settingsOBJ = JSON.parse(fs.readFileSync('./settings.txt'));
  let surveyRegistry = settingsOBJ.surveys;
  let surveysAvailable = settingsOBJ.surveysAvailable;
  let takeableSurvey, surveyOBJ;
  if (!surveyRegistry.hasOwnProperty(msg.author.id)) {
    surveyRegistry[msg.author.id] = [];
  }
  for (let survey in surveysAvailable) {
    if (!surveyRegistry[msg.author.id].includes(survey)) {
      takeableSurvey = survey;
    }
  }
  if (takeableSurvey == null || settingsOBJ.surveysAvailable[takeableSurvey].yes.includes(msg.author.id) || settingsOBJ.surveysAvailable[takeableSurvey].no.includes(msg.author.id)) {
    if (intentional) {
      msg.channel.send("There aren't any new surveys for you.");
    }
    return
  }
  else {
    surveyOBJ = surveysAvailable[takeableSurvey];
  }
  /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  let embed = new Discord.MessageEmbed()
  .setTitle("Enjoying Ougi so far?")
  .setDescription("If so, that's really heartwarming. Mind taking a second to answer the following question?\nUse the reactions I put below.")
  .addField(surveyOBJ.q, surveyOBJ.d)
  .setColor(surveyOBJ.color)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/news.png?raw=true");

  let collectedEmbed = new Discord.MessageEmbed()
  .setTitle("Survey timeout ended.")
  .setDescription("Your feedback is really important for Ougi. Thanks for voting!")
  .addField("\u200b", "If you'd like to check for surveys. Execute `ougi survey`.")
  .setColor(surveyOBJ.color);

  if (surveyOBJ.url != null) {
    embed.addField("\u200b","Feeling generous enough to spend a couple extra minutes? I'd be so glad to hear your thoughts in [this survey](" + surveyOBJ.url + ").");
  }
  settingsOBJ.surveys[msg.author.id].push(takeableSurvey);
  settingsOBJ.surveysAvailable[takeableSurvey].poppedUp++;
  await fs.writeFile('./settings.txt', JSON.stringify(settingsOBJ), 'utf-8', console.error);
  await ougi.backup('./settings.txt', settingsChannel);
  msg.channel.send(embed).then(async (sentMSG) => {
    let filter = (reaction, user) => user.id !== client.user.id;
    await sentMSG.react(client.emojis.cache.get('818120409219334144'))
    .catch(console.error);
    await sentMSG.react(client.emojis.cache.get('818120425757999144'))
    .catch(console.error);
    let collector = sentMSG.createReactionCollector(filter, { time: 900000 });
    collector.on('collect', async (reaction, user) => {
      if (reaction.emoji.id !== '818120409219334144' && reaction.emoji.id !== '818120425757999144') {
        return
      }
      let settingsOBJ = JSON.parse(fs.readFileSync('./settings.txt'));
      let pastVoteA = settingsOBJ.surveysAvailable[takeableSurvey].yes.indexOf(user.id);
      let pastVoteB = settingsOBJ.surveysAvailable[takeableSurvey].no.indexOf(user.id);
      if (pastVoteA >= 0) {
        settingsOBJ.surveysAvailable[takeableSurvey].yes.splice(pastVoteA, 1);
      }
      if (pastVoteB >= 0) {
        settingsOBJ.surveysAvailable[takeableSurvey].no.splice(pastVoteB, 1);
      }
      settingsOBJ.surveysAvailable[takeableSurvey][reaction.emoji.name].push(user.id);

      client.users.cache.get("265257341967007758").send(user.username + " voted " + reaction.emoji.toString() + " in `" + surveyOBJ.q + "`.").catch(console.error);

      await fs.writeFile('./settings.txt', JSON.stringify(settingsOBJ), 'utf-8', console.error);
      await ougi.backup('./settings.txt', settingsChannel);
    })
    collector.on('end', async => {
      sentMSG.edit(collectedEmbed);
    });

  });
}
