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
      msg.channel.send(await ougi.text({ msg, stringID: "feedback_noSurveys" }));
    }
    return;
  }
  const takeableSurvey = surveyResult.surveyId;
  const surveyOBJ = surveyResult.surveyOBJ;
  /*-----------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  let embed = new Discord.EmbedBuilder()
  .setTitle(await ougi.text({ msg, stringID: "feedback_enjoyingTitle" }))
  .setDescription(await ougi.text({ msg, stringID: "feedback_enjoyingDesc" }))
  .addFields({name: surveyOBJ.q, value: surveyOBJ.d})
  .setColor(surveyOBJ.color)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/news.png?raw=true");

  let collectedEmbed = new Discord.EmbedBuilder()
  .setTitle(await ougi.text({ msg, stringID: "feedback_timeoutTitle" }))
  .setDescription(await ougi.text({ msg, stringID: "feedback_timeoutDesc" }))
  .addFields({name: "\u200b", value: await ougi.text({ msg, stringID: "feedback_checkCommand" })})
  .setColor(surveyOBJ.color);

  if (surveyOBJ.url != null) {
    embed.addFields({
      name: "\u200b",
      value: await ougi.text({
        msg,
        stringID: "feedback_spendMinutes",
        values: {
          url: surveyOBJ.url
        }
      })
    });
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

      const votedMsg = await ougi.text({
        lang: davidUserID,
        stringID: "dev_surveyVoted",
        values: {
          user: user.username,
          emoji: reaction.emoji.toString(),
          survey: surveyOBJ.q
        }
      });
      client.users.cache.get(davidUserID).send(votedMsg).catch(console.error);
    })
    collector.on('end', async => {
      sentMSG.edit(collectedEmbed);
    });

  });
}
