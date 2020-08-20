module.exports =

function (msg) {
  var pseudoArray = JSON.parse(fs.readFileSync('./subscribers.txt', 'utf-8', console.error));
  var callerID = msg.author.id;
  if (!pseudoArray.includes(callerID)) {
    msg.channel.send("Beep boop. You weren't subscribed!");
    return
  }
  pseudoArray.splice(pseudoArray.indexOf(callerID));
  var proArray = JSON.stringify(pseudoArray);
  fs.writeFile('./subscribers.txt', proArray, console.error);
  msg.channel.send("You've successfully unsubscribed Ougi's announcements.");
  client.users.cache.get("265257341967007758").send(client.users.cache.get(callerID).username + " unsubscribed :pensive:")
  var mySubs = "./subscribers.txt";
  ougi.backup(mySubs, subscribersChannel);
}
