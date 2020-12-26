module.exports =

async function (msg) {
  let pseudoArray = JSON.parse(fs.readFileSync('./settings.txt', 'utf-8', console.error));
  let callerID = msg.author.id;
  if (!pseudoArray.subscribers.includes(callerID)) {
    msg.channel.send("Beep boop. You weren't subscribed!");
    return
  }
  pseudoArray.subscribers.splice(pseudoArray.subscribers.indexOf(callerID));
  let proArray = JSON.stringify(pseudoArray);
  fs.writeFile('./settings.txt', proArray, console.error);
  msg.channel.send("You've successfully unsubscribed Ougi's announcements.");
  client.users.cache.get("265257341967007758").send(client.users.cache.get(callerID).username + " unsubscribed :pensive:")
  let mySubs = "./settings.txt";
  ougi.backup(mySubs, settingsChannel);
}
