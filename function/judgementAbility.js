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
  let embed = new Discord.MessageEmbed()
  .setTitle("Input for judgementAbility (" + msg.channel.type.replace("dm", "DM").replace("text", "Text") + " channel)")
  .setAuthor(msg.author.username, msg.author.avatarURL({dynamic: true, size: 4096}))
  .setColor("#FF008C")
  .setFooter("globalLogEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}));

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
  embed.addField("Content", notSpookyDM.slice(0, 1024));
  
  let prevSimilarity = stringSimilarity.findBestMatch(notSpookyDM, stringsArray).bestMatch.rating;
  if (prevSimilarity * 100 < 90) {
    let msgTranslation = await ougi.text('en', notSpookyDM, true, true);
    notSpookyDM = msgTranslation.value;
    usedLang = msgTranslation.fromCode || msg;
    embed.addField("Translated for processing", notSpookyDM.slice(0, 1024));
  }

  ougi.ideaCoreProcessor(notSpookyDM);
  msg.channel.startTyping();
  ougi.sleep(500);
  let levenaryIdea = levenary(notSpookyDM, stringsArray);
  let myLevU = leven(notSpookyDM, levenaryIdea);
  embed.addField("Levenshtein matching trigger found with " + myLevU + " Levenshtein distance units", levenaryIdea)
  let judgeThis = stringSimilarity.findBestMatch(notSpookyDM, stringsArray);
  let minSimilarity = 0.33;
  let similarity = judgeThis.bestMatch.rating;
  let comparisonThreshold = 0.25;
  let diceString = judgeThis.bestMatch.target;
  embed.addField("Dice's Coefficient matching trigger found with " + similarity*100 + "% of similarity", diceString);
  let compareLevDice = stringSimilarity.compareTwoStrings(levenaryIdea, diceString);
  let compareDiceLev = leven(levenaryIdea, diceString);
  embed.addField("Levenshtein matching trigger and Dice's Coefficient matching trigger share", "► `" + compareDiceLev + "` Levenshtein distance units\n► `" + compareLevDice*100 + "%` similarity according to Dice's Coefficient");
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
  embed.addField("Ougi's judgementAbility chose the following trigger", thisString);
  embed.addField("This trigger has", "► `" + finalSimilarity*100 + "%` of similarity\n► Current minimum is `" + minSimilarity*100 + "%`\n► `" + finalLevU + "` Levenshtein distance units")
  if (finalSimilarity >= minSimilarity){
    let options = knowledgeBase[thisString];
    let response = options[Math.floor(Math.random()*options.length)];
    if (msg.channel.type !== "dm") {
      response = response
      .replace(/nigga|nigger/gi, "unwhiter")
      .replace(/cock|dick|penis/gi, "coke");
    }
    
    embed.addField("Reply", response);
    if (prevSimilarity * 100 < 90) {
      response = await ougi.text(usedLang, response, true);
      embed.addField("Localized as", response);
    }
    
    msg.channel.send(response).catch(console.error);
    client.channels.cache.get(consoleLogging).send({embed});
    logCount++;
  }
  else {
    embed.addField("Unsatisfied similarity minimum percentage", "Falling back to checkBadWords");
    client.channels.cache.get(consoleLogging).send({embed});
    ougi.checkBadWords(msg);
  }
  msg.channel.stopTyping();
}
