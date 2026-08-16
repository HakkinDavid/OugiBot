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
    msg.channel.send(await ougi.text(msg, "results_notSurvey"));
    return;
  }
  let surveyDone = "\u200b";
  let upvotes = mySurvey.yes.length;
  let downvotes = mySurvey.no.length;
  let total = upvotes + downvotes;
  const descTemplate = await ougi.text(msg, "results_desc");
  const posValTemplate = await ougi.text(msg, "results_positiveVal");
  const negValTemplate = await ougi.text(msg, "results_negativeVal");

  let embed = new Discord.EmbedBuilder()
  .setTitle(await ougi.text(msg, "results_title"))
  .setDescription(
    descTemplate
      .replace(/{question}/g, mySurvey.q)
      .replace(/{surveyId}/g, thisSurvey)
  )
  .setColor(mySurvey.color)
  .addFields({name: await ougi.text(msg, "results_positive"), value: posValTemplate.replace(/{percent}/g, (total > 0 ? upvotes/total*100 : 0))})
  .addFields({name: await ougi.text(msg, "results_negative"), value: negValTemplate.replace(/{percent}/g, (total > 0 ? downvotes/total*100 : 0))})
  .setTimestamp()
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setFooter({text: await ougi.text(msg, "results_footer"), icon: client.user.avatarURL({dynamic: true, size: 4096})});
  if (shouldEnd && msg.author.id == davidUserID) {
    if (mySurvey.ended == null) {
      ougi.db().endSurvey(thisSurvey);
      surveyDone = await ougi.text(msg, "results_ended");
    }
  }
  const durTemplate = await ougi.text(msg, "results_duration");
  embed.addFields({name: surveyDone, value: durTemplate.replace(/{duration}/g, ougi.toHumanTime(mySurvey.started, mySurvey.ended))})
  msg.channel.send({embeds: [embed]});
}
