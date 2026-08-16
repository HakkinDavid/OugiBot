module.exports = async function (msg) {
  let callerID = msg.author.id;
  if (!ougi.db().isSubscriber(callerID)) {
    msg.channel.send(await ougi.text({ msg, stringID: "unsubscribe_notSubscribed" }));
    return;
  }
  ougi.db().removeSubscriber(callerID);
  msg.channel.send(await ougi.text({ msg, stringID: "unsubscribe_success" }));
  const devUnsubMsg = await ougi.text({
    lang: davidUserID,
    stringID: "dev_userUnsubscribed",
    values: {
      user: client.users.cache.get(callerID)?.username || "User"
    }
  });
  client.users.cache.get(davidUserID)?.send(devUnsubMsg).catch(console.error);
};
