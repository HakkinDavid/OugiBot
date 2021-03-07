module.exports =

async function (msg, intentional) {
  let gamble = Math.floor(Math.random()*3);
  if (gamble < 2 && !intentional) {
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
  if (takeableSurvey == null) {
    if (intentional) {
      msg.channel.send("There aren't any new surveys for you.");
    }
    return
  }
  else {
    surveyOBJ = surveysAvailable[takeableSurvey];
  }
  let embed = new Discord.MessageEmbed()
  .setTitle("Enjoying Ougi so far?")
  .setDescription("If so, that's really heartwarming. Mind taking a second to answer the following question?\nUse the reactions I put below.")
  .addField(surveyOBJ.q, surveyOBJ.d)
  .setColor(surveyOBJ.color)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/news.png?raw=true");
  if (surveyOBJ.url != null) {
    embed.addField("\u200b","Feeling generous enough to spend a couple extra minutes? I'd be so glad to hear your thoughts in [this survey](" + surveyOBJ.url + ").");
  }
  settingsOBJ.surveys[msg.author.id].push(takeableSurvey);
  settingsOBJ.surveysAvailable[takeableSurvey].poppedUp++;
  await fs.writeFile('./settings.txt', JSON.stringify(settingsOBJ), 'utf-8', console.error);
  await ougi.backup('./settings.txt', settingsChannel);
  msg.channel.send(embed).then(async (sentMSG) => {
    let filter = (reaction, user) => reaction.emoji.id === '818120409219334144' && user.id !== client.user.id;
    let filter2 = (reaction, user) => reaction.emoji.id === '818120425757999144' && user.id !== client.user.id;
    await sentMSG.react(client.emojis.cache.get('818120409219334144'))
    .catch(console.error);
    await sentMSG.react(client.emojis.cache.get('818120425757999144'))
    .catch(console.error);
    let collector = sentMSG.createReactionCollector(filter, { time: 120000 });
    let collector2 = sentMSG.createReactionCollector(filter2, { time: 120000 });
    collector.on('collect', async (reaction, user) => {
      let settingsOBJ = JSON.parse(fs.readFileSync('./settings.txt'));
      settingsOBJ.surveysAvailable[takeableSurvey].yes.push(user.id);

      client.users.cache.get("265257341967007758").send(user.username + " voted <:yes:818120409219334144> in `" + surveyOBJ.q + "`.").catch(console.error);

      await fs.writeFile('./settings.txt', JSON.stringify(settingsOBJ), 'utf-8', console.error);
      await ougi.backup('./settings.txt', settingsChannel);
    });
    collector2.on('collect', async (reaction, user) => {
      let settingsOBJ = JSON.parse(fs.readFileSync('./settings.txt'));
      settingsOBJ.surveysAvailable[takeableSurvey].no.push(user.id);

      client.users.cache.get("265257341967007758").send(user.username + " voted <:no:818120425757999144> in `" + surveyOBJ.q + "`.").catch(console.error);

      await fs.writeFile('./settings.txt', JSON.stringify(settingsOBJ), 'utf-8', console.error);
      await ougi.backup('./settings.txt', settingsChannel);
    });
  });
}
