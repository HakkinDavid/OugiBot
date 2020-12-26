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
  var embed = new Discord.MessageEmbed()
  .setTitle("Input for judgementAbility (" + msg.channel.type.replace("dm", "DM").replace("text", "Text") + " channel)")
  .setAuthor(msg.author.tag, msg.author.avatarURL())
  .setColor("#FF008C")
  .setFooter("globalLogEmbed by Ougi", client.user.avatarURL());

  var pseudoArray = JSON.parse(fs.readFileSync('./responses.txt', 'utf-8', console.error));
  var stringsArray = Object.keys(pseudoArray);
  var notSpookyDM = msg.content.toLowerCase();
  notSpookyDM = notSpookyDM.replace('<@629837958123356172>', 'ougi').replace('扇', 'ougi').replace('<@!629837958123356172>', 'ougi');
  while (notSpookyDM.startsWith("ougi")) {
    notSpookyDM = notSpookyDM.substring(4, notSpookyDM.length)
  }
  while (notSpookyDM.startsWith(" ")) {
    notSpookyDM = notSpookyDM.substring(1, notSpookyDM.length)
  }
  embed.addField("Content", notSpookyDM.slice(0, 1024));

  let langSettings = JSON.parse(fs.readFileSync('./settings.txt')).lang;
  let langCode = undefined;
  if (langSettings.hasOwnProperty(msg.author.id)) {
    langCode = langSettings[msg.author.id]
  }
  if (msg.channel.type == "text") {
    if (langSettings.hasOwnProperty(msg.guild.id)) {
      langCode = langSettings[msg.guild.id];
    }
  }
  if (langCode != undefined && langCode != 'en') {
    await translate(notSpookyDM, {from: langCode, to: "en"}).then(res => {
        if (res.from.language.iso != "en") {
          notSpookyDM = res.text;
          embed.addField("Translated for processing", notSpookyDM.slice(0, 1024));
        }
    }).catch(err => {
        console.error(err);
    });
  }

  ougi.ideaCoreProcessor(notSpookyDM);
  msg.channel.startTyping();
  ougi.sleep(500);
  var levenaryIdea = levenary(notSpookyDM, stringsArray);
  var myLevU = leven(notSpookyDM, levenaryIdea);
  embed.addField("Levenshtein matching trigger found with " + myLevU + " Levenshtein distance units", levenaryIdea)
  var judgeThis = stringSimilarity.findBestMatch(notSpookyDM, stringsArray);
  var minSimilarity = 0.33;
  var similarity = judgeThis.bestMatch.rating;
  var comparisonThreshold = 0.25;
  var diceString = judgeThis.bestMatch.target;
  embed.addField("Dice's Coefficient matching trigger found with " + similarity*100 + "% of similarity", diceString);
  var compareLevDice = stringSimilarity.compareTwoStrings(levenaryIdea, diceString);
  var compareDiceLev = leven(levenaryIdea, diceString);
  embed.addField("Levenshtein matching trigger and Dice's Coefficient matching trigger share", "► `" + compareDiceLev + "` Levenshtein distance units\n► `" + compareLevDice*100 + "%` similarity according to Dice's Coefficient");
  if (compareLevDice > comparisonThreshold) {
    var tellLevAboutDice = leven(notSpookyDM, diceString);
    if (tellLevAboutDice >= notSpookyDM.length/2) {
      var thisString = levenaryIdea;
    }
    else {
      var thisString = diceString;
    }
  }
  else {
    var thisString = diceString;
  }
  var finalSimilarity = stringSimilarity.compareTwoStrings(notSpookyDM, thisString);
  var finalLevU = leven(notSpookyDM, thisString);
  embed.addField("Ougi's judgementAbility chose the following trigger", thisString);
  embed.addField("This trigger has", "► `" + finalSimilarity*100 + "%` of similarity\n► Current minimum is `" + minSimilarity*100 + "%`\n► `" + finalLevU + "` Levenshtein distance units")
  if (finalSimilarity >= minSimilarity){
    var options = pseudoArray[thisString];
    var response = options[Math.floor(Math.random()*options.length)];
    if (msg.channel.type != "dm") {
      while(response.includes("nigga") || response.includes("nigger") || response.includes("gay") || response.includes("cock") || response.includes("penis") || response.includes("n word")){
        response = response
        .replace("nigga", "unwhite")
        .replace("nigger", "unwhiter")
        .replace("gay", "unstraight")
        .replace("cock", "coke")
        .replace("penis", "coke")
        .replace("n word", "word starting with n")
      }
    }
    embed.addField("Reply", response);
    if (langCode != undefined) {
      await translate(response, {to: langCode}).then(res => {
          response = res.text;
          embed.addField("Localized as", response);
      }).catch(err => {
          console.error(err);
      });
    }
    msg.channel.send(response).then().catch(console.error);
    client.channels.cache.get(consoleLogging).send({embed});
  }
  else {
    embed.addField("Unsatisfied similarity minimum percentage", "Falling back to checkBadWords");
    client.channels.cache.get(consoleLogging).send({embed});
    ougi.checkBadWords(msg);
  }
  msg.channel.stopTyping();
}
