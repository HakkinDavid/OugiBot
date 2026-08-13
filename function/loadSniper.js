module.exports = function (msg, isEdit) {
  if (msg.author?.bot) return;
  if (ougi.helperFunctions.checkForPrefix(msg)) return;
  let channelID = msg.channel.id;
  let now = Date.now();
  let thisArray = {
    text: msg.content || "",
    pfp: msg.author.avatarURL({ dynamic: true, size: 4096 }),
    author: msg.author.username,
    files: msg.attachments ? msg.attachments.map((f) => ({ name: f.name, url: f.url })) : [],
    timestamp: now
  };

  const target = isEdit ? reloadedAmmo : ammo;
  if (!target[channelID]) target[channelID] = [];

  // Prune entries older than 1 hour (3600000ms)
  target[channelID] = target[channelID].filter(item => now - item.timestamp < 3600000);

  // Unshift new entry
  target[channelID].unshift(thisArray);

  // Cap at 10 messages per channel
  if (target[channelID].length > 10) {
    target[channelID] = target[channelID].slice(0, 10);
  }
};
