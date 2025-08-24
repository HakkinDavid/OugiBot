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
  let breakChocolate = thisSurvey.split("::").slice(1);
  if (breakChocolate.length < 2) {
    msg.channel.send("You must include a survey ID and a description.")
    return
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
    msg.channel.send("You must include a survey ID and a description that's 1 to 1024 characters long.")
    return
  }
  if (!settingsOBJ.surveysAvailable.hasOwnProperty(surveyID)) {
    msg.channel.send("Not a survey ID yet.");
    return
  }
  let surveyDone = "\u200b";
  let mySurvey = settingsOBJ.surveysAvailable[surveyID];
  let upvoters = mySurvey.yes;
  let embed = new Discord.EmbedBuilder()
  .setTitle('Survey unique notification')
  .setDescription("You're receiving this feedback notification since you upvoted the following survey at least once.\n<:unknown_emoji:731996283790950420> **Question:** *" + mySurvey.q + "*")
  .addFields({name: "\u200b", value: notification})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/news.png?raw=true")
  .setColor(mySurvey.color)
  .setTimestamp()
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setFooter({text: "surveyNotificationEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})});
  let names = [];
  let mod = 0;
  for (i=0; upvoters.length > i; i++) {
    let anUpvoter = client.users.cache.get(upvoters[i]);
    if (anUpvoter != undefined) {
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
  msg.channel.send("Sent this newsletter to:\n" + names.join('\n'), {embeds: [embed]});
}
