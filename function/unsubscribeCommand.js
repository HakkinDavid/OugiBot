module.exports = async function (msg) {
  let callerID = msg.author.id;
  if (!settingsOBJ.subscribers.includes(callerID)) {
    msg.channel.send("Beep boop. You weren't subscribed!");
    return;
  }
  settingsOBJ.subscribers.splice(settingsOBJ.subscribers.indexOf(callerID), 1);
  ougi.db().saveKV('settings', 'kv', 'settingsOBJ', settingsOBJ);
  msg.channel.send("You've successfully unsubscribed Ougi's announcements.");
  client.users.cache.get(davidUserID)?.send(client.users.cache.get(callerID).username + " unsubscribed :pensive:").catch(console.error);
};
