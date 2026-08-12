module.exports = async function (msg) {
  let callerID = msg.author.id;
  if (!ougi.db().isSubscriber(callerID)) {
    msg.channel.send("Beep boop. You weren't subscribed!");
    return;
  }
  ougi.db().removeSubscriber(callerID);
  msg.channel.send("You've successfully unsubscribed Ougi's announcements.");
  client.users.cache.get(davidUserID)?.send(client.users.cache.get(callerID).username + " unsubscribed :pensive:").catch(console.error);
};
