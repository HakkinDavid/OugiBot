module.exports =

async function (msg) {
  let callerID = msg.author.id;
  if (!settingsOBJ.subscribers.includes(callerID)) {
    msg.channel.send("Beep boop. You weren't subscribed!");
    return
  }
  settingsOBJ.subscribers.splice(settingsOBJ.subscribers.indexOf(callerID));
  fs.writeFile('./settings.txt', JSON.stringify(settingsOBJ), console.error);
  msg.channel.send("You've successfully unsubscribed Ougi's announcements.");
  client.users.cache.get("265257341967007758").send(client.users.cache.get(callerID).username + " unsubscribed :pensive:")
  ougi.backup("./settings.txt", settingsChannel);
}
