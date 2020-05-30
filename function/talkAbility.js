module.exports =

function talkAbility(msg) {
  var pseudoArray = JSON.parse(fs.readFileSync('./responses', 'utf-8', console.error));
  var notSpookyDM = msg.content.toLowerCase();
  while (notSpookyDM.startsWith("ougi")) {
    notSpookyDM = notSpookyDM.substring(3, notSpookyDM.length)
  }
  while (notSpookyDM.startsWith(" ")) {
    notSpookyDM = notSpookyDM.substring(1, notSpookyDM.length)
  }
  msg.channel.startTyping();
  ougi.sleep(500);
  if (msg.author.id == "504307125653078027"){
    var personalizedArray = JSON.parse(fs.readFileSync('./gusresponses', 'utf-8', console.error));
    if (personalizedArray.hasOwnProperty(notSpookyDM)){
      var options = personalizedArray[notSpookyDM];
      var response = options[Math.floor(Math.random()*options.length)];
      msg.channel.send(response).then().catch(console.error);
      msg.channel.stopTyping();
      return
    }
  }
  if (pseudoArray.hasOwnProperty(notSpookyDM)){
    var options = pseudoArray[notSpookyDM];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
  }
  else {
    ougi.checkBadWords(arguments, msg);
  }
  msg.channel.stopTyping();
}
