module.exports =

function (msg) {
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
  let settingsOBJ = JSON.parse(fs.readFileSync('./settings.txt'));
  if (!settingsOBJ.surveysAvailable.hasOwnProperty(thisSurvey)) {
    msg.channel.send("Not a survey ID yet.");
    return
  }
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
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setFooter("surveyResultsEmbed by Ougi", client.user.avatarURL());
  msg.channel.send(embed);
}
