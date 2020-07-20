module.exports =

function mimicAbility(msg) {
  var multipleLog = [];
  var spookyLog = '**Input for mimicAbility received through ' + msg.channel.type + ' channel**\n> ' + msg.cleanContent + '\n';

  multipleLog.push(spookyLog.replace("@everyone", "@.everyone").replace("@here", "@.here"));
  var uSaid = msg.content.toLowerCase();
  var iSaid = uSaid
  .replace("ougi", msg.author.username)
  .replace("扇忍野", msg.author.username)
  .replace("扇", msg.author.username)
  .replace("<@!629837958123356172>", msg.author.username)
  .replace("<@629837958123356172>", msg.author.username)
  .replace("i am", "you are not")
  .replace("smart", "dumb")
  .replace("cute", "ugly")
  .replace("funny", "unfunny")
  .replace("@everyone", "no one")
  .replace("@here", "unhere");
  if (uSaid == iSaid) {
    iSaid = randomCase(iSaid);
  }
  msg.channel.send(iSaid);
  multipleLog.push("**Replied**\n> " + iSaid.replace('<@!265257341967007758>', client.users.get('265257341967007758').tag).replace('<@265257341967007758>', client.users.get('265257341967007758').tag));
  console.log(multipleLog.join("\n"));
}
