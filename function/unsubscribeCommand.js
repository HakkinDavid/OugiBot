module.exports = async function (msg) {
  let callerID = msg.author.id;
  if (!ougi.db().isSubscriber(callerID)) {
    msg.channel.send(await ougi.text(msg, "unsubscribe_notSubscribed"));
    return;
  }
  ougi.db().removeSubscriber(callerID);
  msg.channel.send(await ougi.text(msg, "unsubscribe_success"));
  client.users.cache.get(davidUserID)?.send(client.users.cache.get(callerID).username + " unsubscribed :pensive:").catch(console.error);
};
