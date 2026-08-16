module.exports =

async function (msg, shouldEnd) {
  /*-----------------------------------*/
  while (msg.content.includes('  ')) {
    msg.content = msg.content.replace('  ', ' ')
  }
  while (msg.content.includes('\n\n')) {
    msg.content = msg.content.replace('\n\n', '\n')
  }
  let spookyCake = msg.content;
  let spookySlices = spookyCake.split(" ");
  let spookyCommand = spookySlices[1];
  let arguments = spookySlices.slice(2);
  /*-----------------------------------*/
  let thisSurvey = arguments.join(" ");
  let mySurvey = ougi.db().getSurvey(thisSurvey);
  if (!mySurvey) {
    msg.channel.send(await ougi.text({ msg, stringID: "results_notSurvey" }));
    return;
  }
  let surveyDone = "\u200b";
  let upvotes = mySurvey.yes.length;
  let downvotes = mySurvey.no.length;
  let total = upvotes + downvotes;

  let embed = new Discord.EmbedBuilder()
  .setTitle(await ougi.text({ msg, stringID: "results_title" }))
  .setDescription(
    await ougi.text({
      msg,
      stringID: "results_desc",
      values: {
        question: mySurvey.q,
        surveyId: thisSurvey
      }
    })
  )
  .setColor(mySurvey.color)
  .addFields({name: await ougi.text({ msg, stringID: "results_positive" }), value: await ougi.text({ msg, stringID: "results_positiveVal", values: { percent: (total > 0 ? upvotes/total*100 : 0) } })})
  .addFields({name: await ougi.text({ msg, stringID: "results_negative" }), value: await ougi.text({ msg, stringID: "results_negativeVal", values: { percent: (total > 0 ? downvotes/total*100 : 0) } })})
  .setTimestamp()
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setFooter({text: await ougi.text({ msg, stringID: "results_footer" }), icon: client.user.avatarURL({dynamic: true, size: 4096})});
  if (shouldEnd && msg.author.id == davidUserID) {
    if (mySurvey.ended == null) {
      ougi.db().endSurvey(thisSurvey);
      surveyDone = await ougi.text({ msg, stringID: "results_ended" });
    }
  }
  embed.addFields({name: surveyDone, value: await ougi.text({ msg, stringID: "results_duration", values: { duration: ougi.toHumanTime(mySurvey.started, mySurvey.ended) } })})
  msg.channel.send({embeds: [embed]});
}
