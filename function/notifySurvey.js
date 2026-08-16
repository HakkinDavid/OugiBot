module.exports =

async function (msg) {
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
  let breakChocolate = thisSurvey.split("::").slice(1);
  if (breakChocolate.length < 2) {
    msg.channel.send(await ougi.text(msg, "survey_notifyMissingFields"));
    return;
  }
  let surveyID, notification;
  for (i=0; breakChocolate.length > i; i++) {
    let material = breakChocolate[i];
    if (material.endsWith(" ")) {
      material = material.slice(0, material.length-1)
    }
    if (material.startsWith("id ")) {
      material = material.slice(3);
      surveyID = material;
    }
    else if (material.startsWith("description ")) {
      material = material.slice(12);
      notification = material;
    }
  }
  if (surveyID == null || notification == null || notification.length < 1 || notification.length > 1024) {
    msg.channel.send(await ougi.text(msg, "survey_notifyMissingFields"));
    return;
  }
  let mySurvey = ougi.db().getSurvey(surveyID);
  if (!mySurvey) {
    msg.channel.send(await ougi.text(msg, "survey_notSurveyId"));
    return;
  }
  let upvoters = mySurvey.yes;
  const descTemplate = await ougi.text(msg, "survey_notificationDesc");
  let embed = new Discord.EmbedBuilder()
  .setTitle(await ougi.text(msg, "survey_notificationTitle"))
  .setDescription(descTemplate.replace(/{question}/g, mySurvey.q))
  .addFields({name: "\u200b", value: notification})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/news.png?raw=true")
  .setColor(mySurvey.color)
  .setTimestamp()
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setFooter({text: await ougi.text(msg, "survey_notificationFooter"), icon: client.user.avatarURL({dynamic: true, size: 4096})});
  let names = [];
  let mod = 0;
  for (let i = 0; upvoters.length > i; i++) {
    let anUpvoter = null;
    try { anUpvoter = await client.users.fetch(upvoters[i]); }
    catch { }
    if (anUpvoter) {
      anUpvoter.send({embeds: [embed]}).catch(console.error);
      names.push(anUpvoter.username);
    }
    else {
      mod++
    }
  }
  if (mod > 0) {
    ougi.globalLog("Skipped " + mod + " invalid IDs.")
  }
  msg.channel.send({ content: "Sent this notification to:\n" + names.join('\n'), embeds: [embed] });
}
