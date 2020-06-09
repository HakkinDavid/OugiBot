module.exports =

function talkAbility(msg) {
  while (msg.content.includes('  ')) {
    msg.content = msg.content.replace('  ', ' ')
  }
  console.log('**Input for talkAbility received through ' + msg.channel.type + ' channel**\n> ' + msg.content + '\n');
  var pseudoArray = JSON.parse(fs.readFileSync('./responses', 'utf-8', console.error));
  var notSpookyDM = msg.content.toLowerCase();
  notSpookyDM = notSpookyDM.replace('<@629837958123356172>', 'ougi').replace('扇', 'ougi');
  while (notSpookyDM.startsWith("ougi")) {
    notSpookyDM = notSpookyDM.substring(4, notSpookyDM.length)
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
      console.log("**Replied**\n> " + response);
      msg.channel.stopTyping();
      return
    }
  }
  if (pseudoArray.hasOwnProperty(notSpookyDM)){
    var options = pseudoArray[notSpookyDM];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
    console.log("**Replied**\n> " + response);
  }
  else {
    console.log("*I have no reply for that. I'll checkBadWords.*");
    ougi.checkBadWords(arguments, msg);
  }
  msg.channel.stopTyping();
}
