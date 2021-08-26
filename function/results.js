module.exports =

function (msg, shouldEnd) {
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
  let embed = new Discord.MessageEmbed()
  .setTitle('Survey results')
  .setDescription("<:unknown_emoji:731996283790950420> **Question:** *" + mySurvey.q + "*\n🆔 **Survey ID:** `" + thisSurvey + "`")
  .setColor(mySurvey.color)
  .addField("Positive votes:", upvotes/total*100 + "% of total votes.")
  .addField("Negative votes:", downvotes/total*100 + "% of total votes.")
  .setTimestamp()
  .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
  .setFooter("surveyResultsEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}));
  if (shouldEnd && msg.author.id == "265257341967007758") {
    if (settingsOBJ.surveysAvailable[thisSurvey].ended == null) {
      settingsOBJ.surveysAvailable[thisSurvey].ended = new Date().getTime();
      surveyDone = "Survey has ended!";
    }
    fs.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), 'utf-8', console.error);
    ougi.backup('./settings.txt', settingsChannel);
  }
  embed.addField(surveyDone, "Duration: " + ougi.toHumanTime(mySurvey.started, mySurvey.ended) + ".")
  msg.channel.send(embed);
}
