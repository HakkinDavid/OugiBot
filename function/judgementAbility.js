module.exports =

function talkAbility(msg) {
  var multipleLog = [];
  while (msg.content.includes('  ')) {
    msg.content = msg.content.replace('  ', ' ')
  }
  while (msg.content.includes('\n\n')) {
    msg.content = msg.content.replace('\n\n', '\n')
  }
  while (msg.content.includes('\n')) {
    msg.content = msg.content.replace('\n', ' ')
  }
  var spookyLog = '**Input for judgementAbility received through ' + msg.channel.type + ' channel**\n> ' + msg.cleanContent + '\n';

  multipleLog.push(spookyLog.replace("@everyone", "@.everyone").replace("@here", "@.here"));

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
  msg.channel.startTyping();
  ougi.sleep(500);
  var levenaryIdea = levenary(notSpookyDM, stringsArray);
  var myLevU = leven(notSpookyDM, levenaryIdea);
  multipleLog.push("**Levenshtein matching trigger found with " + myLevU + " Levenshtein distance units.**\n> " + levenaryIdea);
  var judgeThis = stringSimilarity.findBestMatch(notSpookyDM, stringsArray);
  var minSimilarity = 0.33;
  var similarity = judgeThis.bestMatch.rating;
  var comparisonThreshold = 0.8;
  var diceString = judgeThis.bestMatch.target;
  multipleLog.push("**Dice's Coefficient matching trigger found with " + similarity*100 + "% of similarity.**\n> " + diceString);
  var compareLevDice = stringSimilarity.compareTwoStrings(levenaryIdea, diceString);
  var compareDiceLev = leven(levenaryIdea, diceString);
  multipleLog.push("`Levenshtein matching trigger and Dice's Coefficient matching trigger share " + compareDiceLev + " Levenshtein distance units and " + compareLevDice*100 + "% similarity according to Dice's Coefficient.`");
  if (compareLevDice < comparisonThreshold) {
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
  multipleLog.push("**Ougi's judgementAbility has determined the following trigger is the best available option, with " + finalSimilarity*100 + "% of similarity (current minimum is " + minSimilarity*100 + "%) and " + finalLevU + " Levenshtein distance units.**\n> " + thisString);

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
    msg.channel.send(response).then().catch(console.error);
    multipleLog.push("**Replied**\n> " + response);
    console.log(multipleLog.join("\n"));
  }
  else {
    multipleLog.push("*The trigger above doesn't satisfy the minimum similarity percent. I'll proceed to checkBadWords.*");
    console.log(multipleLog.join("\n"));
    ougi.checkBadWords(msg);
  }
  msg.channel.stopTyping();
}
