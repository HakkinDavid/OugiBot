module.exports = async function (msg) {
  let callerID = msg.author.id;
  if (ougi.db().isSubscriber(callerID)) {
    msg.channel.send(await ougi.text(msg, "subscribe_alreadySubscribed"));
    return;
  }
  ougi.db().addSubscriber(callerID);

  const callerUser = client.users.cache.get(callerID);
  const thanksTitleTemplate = await ougi.text(msg, "subscribe_thanksTitle");
  let embed = new Discord.EmbedBuilder()
    .setTitle(thanksTitleTemplate.replace(/{username}/g, callerUser?.username || "Friend"))
    .setColor("#000000")
    .setDescription(await ougi.text(msg, "subscribe_thanksDesc"))
    .setFooter({ text: await ougi.text(msg, "subscribe_footer"), iconURL: client.user.avatarURL({ dynamic: true, size: 4096 }) })
    .setThumbnail(callerUser?.avatarURL({ dynamic: true, size: 4096 }))
    .setImage("https://github.com/HakkinDavid/OugiBot/blob/master/images/veryepic.png?raw=true");

  const notifyTitleTemplate = await ougi.text(davidUserID, "subscribe_notificationTitle");
  let subscribeNotificationEmbed = new Discord.EmbedBuilder()
    .setTitle(notifyTitleTemplate.replace(/{username}/g, callerUser?.username || "Friend"))
    .setDescription(await ougi.text(davidUserID, "subscribe_notificationDesc"))
    .setColor("#000000")
    .setFooter({ text: await ougi.text(davidUserID, "subscribe_notificationFooter"), iconURL: client.user.avatarURL({ dynamic: true, size: 4096 }) })
    .setThumbnail(callerUser?.avatarURL({ dynamic: true, size: 4096 }))
    .setImage("https://github.com/HakkinDavid/OugiBot/blob/master/images/veryepic.png?raw=true");

  const inviteMsg = (await ougi.text(msg, "dev_subscribeDevInvite"))
    .replace(/{creator}/g, client.users.cache.get(davidUserID)?.username || "David");

  callerUser?.send({ content: inviteMsg, embeds: [embed] })
    .then(() => { client.users.cache.get(davidUserID).send({ embeds: [subscribeNotificationEmbed] }).catch(console.error); })
    .catch(console.error);

  if (msg.channel.type !== Discord.ChannelType.DM) {
    msg.channel.send(await ougi.text(msg, "subscribe_checkDms")).catch(console.error);
  }
};
