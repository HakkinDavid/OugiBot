module.exports =

function (msg, isEdit) {
  let channelID = msg.channel.id;
  let thisArray = {
    text: msg.content,
    pfp: msg.author.avatarURL(),
    author: msg.author.username,
    files: msg.attachments.map((files) => files.proxyUrl)
  };
  if (isEdit) {
    if (reloadedAmmo[channelID] == undefined) {
      reloadedAmmo[channelID] = [];
    }
    reloadedAmmo[channelID].unshift(thisArray);
  }
  else {
    if (ammo[channelID] == undefined) {
      ammo[channelID] = [];
    }
    ammo[channelID].unshift(thisArray);
  }
}
