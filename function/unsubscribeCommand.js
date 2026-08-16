module.exports = async function (msg) {
  let callerID = msg.author.id;
  if (!ougi.db().isSubscriber(callerID)) {
    msg.channel.send(await ougi.text(msg, "unsubscribe_notSubscribed"));
    return;
  }
  ougi.db().removeSubscriber(callerID);
  msg.channel.send(await ougi.text(msg, "unsubscribe_success"));
  const devUnsubMsg = (await ougi.text(davidUserID, "dev_userUnsubscribed"))
    .replace(/{user}/g, client.users.cache.get(callerID)?.username || "User");
  client.users.cache.get(davidUserID)?.send(devUnsubMsg).catch(console.error);
};
