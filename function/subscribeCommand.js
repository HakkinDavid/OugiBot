module.exports = async function (msg) {
  let callerID = msg.author.id;
  if (ougi.db().isSubscriber(callerID)) {
    msg.channel.send(await ougi.text({ msg, stringID: "subscribe_alreadySubscribed" }));
    return;
  }
  ougi.db().addSubscriber(callerID);

  const callerUser = client.users.cache.get(callerID);
  let embed = new Discord.EmbedBuilder()
    .setTitle(await ougi.text({ msg, stringID: "subscribe_thanksTitle", values: { username: callerUser?.username || "Friend" } }))
    .setColor("#000000")
    .setDescription(await ougi.text({ msg, stringID: "subscribe_thanksDesc" }))
    .setFooter({ text: await ougi.text({ msg, stringID: "subscribe_footer" }), iconURL: client.user.avatarURL({ dynamic: true, size: 4096 }) })
    .setThumbnail(callerUser?.avatarURL({ dynamic: true, size: 4096 }))
    .setImage("https://github.com/HakkinDavid/OugiBot/blob/master/images/veryepic.png?raw=true");

  let subscribeNotificationEmbed = new Discord.EmbedBuilder()
    .setTitle(await ougi.text({ lang: davidUserID, stringID: "subscribe_notificationTitle", values: { username: callerUser?.username || "Friend" } }))
    .setDescription(await ougi.text({ lang: davidUserID, stringID: "subscribe_notificationDesc" }))
    .setColor("#000000")
    .setFooter({ text: await ougi.text({ lang: davidUserID, stringID: "subscribe_notificationFooter" }), iconURL: client.user.avatarURL({ dynamic: true, size: 4096 }) })
    .setThumbnail(callerUser?.avatarURL({ dynamic: true, size: 4096 }))
    .setImage("https://github.com/HakkinDavid/OugiBot/blob/master/images/veryepic.png?raw=true");

  const inviteMsg = await ougi.text({
    msg,
    stringID: "dev_subscribeDevInvite",
    values: { creator: client.users.cache.get(davidUserID)?.username || "David" }
  });

  callerUser?.send({ content: inviteMsg, embeds: [embed] })
    .then(() => { client.users.cache.get(davidUserID).send({ embeds: [subscribeNotificationEmbed] }).catch(console.error); })
    .catch(console.error);

  if (msg.channel.type !== Discord.ChannelType.DM) {
    msg.channel.send(await ougi.text({ msg, stringID: "subscribe_checkDms" })).catch(console.error);
  }
};
