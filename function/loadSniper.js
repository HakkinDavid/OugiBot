module.exports =

function (msg) {
  let channelID = msg.channel.id;
  if (ammo[channelID] == undefined) {
    ammo[channelID] = [];
  }

  let thisArray = {
    text: msg.content,
    pfp: msg.author.avatarURL(),
    author: msg.author.username,
    files: msg.attachments.map((files) => files.proxyUrl).join(" ")
  };

  ammo[channelID].unshift(thisArray);
}
