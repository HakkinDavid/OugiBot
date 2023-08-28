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
  if (!settingsOBJ.surveysAvailable.hasOwnProperty(thisSurvey)) {
    msg.channel.send("Not a survey ID yet.");
    return
  }
  let surveyDone = "\u200b";
  let mySurvey = settingsOBJ.surveysAvailable[thisSurvey];
  let upvotes = mySurvey.yes.length;
  let downvotes = mySurvey.no.length;
  let total = upvotes + downvotes;
  let embed = new Discord.EmbedBuilder()
  .setTitle('Survey results')
  .setDescription("<:unknown_emoji:731996283790950420> **Question:** *" + mySurvey.q + "*\n🆔 **Survey ID:** `" + thisSurvey + "`")
  .setColor(mySurvey.color)
  .addFields({name: "Positive votes:", value: upvotes/total*100 + "% of total votes."})
  .addFields({name: "Negative votes:", value: downvotes/total*100 + "% of total votes."})
  .setTimestamp()
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setFooter({text: "surveyResultsEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})});
  if (shouldEnd && msg.author.id == davidUserID) {
    if (settingsOBJ.surveysAvailable[thisSurvey].ended == null) {
      settingsOBJ.surveysAvailable[thisSurvey].ended = new Date().getTime();
      surveyDone = "Survey has ended!";
    }
    await ougi.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);
    await ougi.backup('./settings.txt', settingsChannel);
  }
  embed.addFields({name: surveyDone, value: "Duration: " + ougi.toHumanTime(mySurvey.started, mySurvey.ended) + "."})
  msg.channel.send({embeds: [embed]});
}
