module.exports =

async function (msg) {
  let callerID = msg.author.id;
  if (!settingsOBJ.subscribers.includes(callerID)) {
    msg.channel.send("Beep boop. You weren't subscribed!");
    return
  }
  settingsOBJ.subscribers.splice(settingsOBJ.subscribers.indexOf(callerID));
  await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
  msg.channel.send("You've successfully unsubscribed Ougi's announcements.");
  client.users.cache.get(davidUserID).send(client.users.cache.get(callerID).username + " unsubscribed :pensive:")
  await ougi.backup("./settings.txt", channels.settings);
}
