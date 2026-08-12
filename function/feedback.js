module.exports =

async function (msg, intentional) {
  if (!intentional && msg.content.toLowerCase().startsWith("ougi survey")) {
    return
  }
  let gamble = Math.floor(Math.random()*3);
  if (gamble < 1 && !intentional) {
    return
  }
  const surveyResult = ougi.db().findTakeableSurvey(msg.author.id);
  if (!surveyResult) {
    if (intentional) {
      msg.channel.send("There aren't any new surveys for you.");
    }
    return;
  }
  const takeableSurvey = surveyResult.surveyId;
  const surveyOBJ = surveyResult.surveyOBJ;
  /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  let embed = new Discord.EmbedBuilder()
  .setTitle("Enjoying Ougi so far?")
  .setDescription("If so, that's really heartwarming. Mind taking a second to answer the following question?\nUse the reactions I put below.")
  .addFields({name: surveyOBJ.q, value: surveyOBJ.d})
  .setColor(surveyOBJ.color)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/news.png?raw=true");

  let collectedEmbed = new Discord.EmbedBuilder()
  .setTitle("Survey timeout ended.")
  .setDescription("Your feedback is really important for Ougi. Thanks for voting!")
  .addFields({name: "\u200b", value: "If you'd like to check for surveys. Execute `ougi survey`."})
  .setColor(surveyOBJ.color);

  if (surveyOBJ.url != null) {
    embed.addFields({name: "\u200b", value: "Feeling generous enough to spend a couple extra minutes? I'd be so glad to hear your thoughts in [this survey](" + surveyOBJ.url + ")."});
  }
  ougi.db().markSurveySeen(msg.author.id, takeableSurvey);
  ougi.db().incrementSurveyPoppedUp(takeableSurvey);
  msg.channel.send({embeds: [embed]}).then(async (sentMSG) => {
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
      ougi.db().markSurveySeen(msg.author.id, takeableSurvey);
      const voteKey = reaction.emoji.id === '818120409219334144' ? 'yes' : 'no';
      ougi.db().recordSurveyVote(takeableSurvey, user.id, voteKey);

      client.users.cache.get(davidUserID).send(user.username + " voted " + reaction.emoji.toString() + " in `" + surveyOBJ.q + "`.").catch(console.error);
    })
    collector.on('end', async => {
      sentMSG.edit(collectedEmbed);
    });

  });
}
