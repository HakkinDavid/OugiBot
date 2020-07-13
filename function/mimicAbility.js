module.exports =

function mimicAbility(msg) {
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
  iSaid = iSaid;
  msg.channel.send(iSaid);
  console.log("**Replied**\n> " + iSaid.replace('<@!265257341967007758>', client.users.get('265257341967007758').tag).replace('<@265257341967007758>', client.users.get('265257341967007758').tag))
}
