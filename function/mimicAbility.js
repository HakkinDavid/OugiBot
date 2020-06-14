module.exports =

function mimicAbility(msg) {
  var uSaid = msg.content;
  var iSaid = uSaid.toLowerCase()
  .replace("ougi", msg.author.username)
  .replace(msg.author.username.toLowerCase() + " is", "ougi is")
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
  console.log("**Replied**\n> " + iSaid)
}
