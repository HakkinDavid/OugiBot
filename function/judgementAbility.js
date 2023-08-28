module.exports =

async function (msg) {
  while (msg.content.includes('  ')) {
    msg.content = msg.content.replace('  ', ' ')
  }
  while (msg.content.includes('\n\n')) {
    msg.content = msg.content.replace('\n\n', '\n')
  }
  while (msg.content.includes('\n')) {
    msg.content = msg.content.replace('\n', ' ')
  }
  let embed = new Discord.EmbedBuilder()
  .setTitle("Input for judgementAbility (" + msg.channel.type + " type channel)")
  .setAuthor({name: msg.author.username, icon: msg.author.avatarURL({dynamic: true, size: 4096})})
  .setColor("#FF008C")
  .setFooter({text: "globalLogEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})});

  let stringsArray = Object.keys(knowledgeBase);
  let notSpookyDM = msg.content.toLowerCase();
  let usedLang;
  notSpookyDM = notSpookyDM.replace('<@629837958123356172>', 'ougi').replace('扇', 'ougi').replace('<@!629837958123356172>', 'ougi');
  while (notSpookyDM.startsWith("ougi")) {
    notSpookyDM = notSpookyDM.substring(4, notSpookyDM.length)
  }
  while (notSpookyDM.startsWith(" ")) {
    notSpookyDM = notSpookyDM.substring(1, notSpookyDM.length)
  }
  embed.addFields({name: "Content", value: notSpookyDM.slice(0, 1024)});
  
  let prevSimilarity = stringSimilarity.findBestMatch(notSpookyDM, stringsArray).bestMatch.rating;
  if (prevSimilarity * 100 < 90) {
    let msgTranslation = await ougi.text('en', notSpookyDM, true, true);
    notSpookyDM = msgTranslation.value;
    usedLang = msgTranslation.fromCode || msg;
    embed.addFields({name: "Translated for processing", value: notSpookyDM.slice(0, 1024)});
  }

  ougi.ideaCoreProcessor(notSpookyDM);
  ougi.sleep(500);
  let levenaryIdea = levenary(notSpookyDM, stringsArray);
  let myLevU = leven(notSpookyDM, levenaryIdea);
  embed.addFields({name: "Levenshtein matching trigger found with " + myLevU + " Levenshtein distance units", value: levenaryIdea})
  let judgeThis = stringSimilarity.findBestMatch(notSpookyDM, stringsArray);
  let minSimilarity = 0.33;
  let similarity = judgeThis.bestMatch.rating;
  let comparisonThreshold = 0.25;
  let diceString = judgeThis.bestMatch.target;
  embed.addFields({name: "Dice's Coefficient matching trigger found with " + similarity*100 + "% of similarity", value: diceString});
  let compareLevDice = stringSimilarity.compareTwoStrings(levenaryIdea, diceString);
  let compareDiceLev = leven(levenaryIdea, diceString);
  embed.addFields({name: "Levenshtein matching trigger and Dice's Coefficient matching trigger share", value: "► `" + compareDiceLev + "` Levenshtein distance units\n► `" + compareLevDice*100 + "%` similarity according to Dice's Coefficient"});
  let tellLevAboutDice = leven(notSpookyDM, diceString);
  let thisString;
  if (compareLevDice > comparisonThreshold) {
    if (tellLevAboutDice >= notSpookyDM.length/2) {
      thisString = levenaryIdea;
    }
    else {
      thisString = diceString;
    }
  }
  else {
    thisString = diceString;
  }
  let finalSimilarity = stringSimilarity.compareTwoStrings(notSpookyDM, thisString);
  let finalLevU = leven(notSpookyDM, thisString);
  embed.addFields({name: "Ougi's judgementAbility chose the following trigger", value: thisString});
  embed.addFields({name: "This trigger has", value: "► `" + finalSimilarity*100 + "%` of similarity\n► Current minimum is `" + minSimilarity*100 + "%`\n► `" + finalLevU + "` Levenshtein distance units"})
  if (finalSimilarity >= minSimilarity){
    let options = knowledgeBase[thisString];
    let response = options[Math.floor(Math.random()*options.length)];
    if (msg.channel.type !== Discord.ChannelType.DM) {
      response = response
      .replace(/nigga|nigger/gi, "unwhiter")
      .replace(/cock|dick|penis/gi, "coke");
    }
    
    embed.addFields({name: "Reply", value: response});
    if (prevSimilarity * 100 < 90) {
      response = await ougi.text(usedLang, response, true);
      embed.addFields({name: "Localized as", value: response});
    }
    
    msg.channel.send(response).catch(console.error);
    client.channels.cache.get(consoleLogging).send({embeds: [embed]});
  }
  else {
    embed.addFields({name: "Unsatisfied similarity minimum percentage", value: "Falling back to checkBadWords"});
    client.channels.cache.get(consoleLogging).send({embeds: [embed]});
    ougi.checkBadWords(msg);
  }
  global.logsCount++;
}
