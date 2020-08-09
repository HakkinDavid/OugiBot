module.exports =

function (msg) {
  var channelID = msg.channel.id;
  if (fs.existsSync('./ammo/' + channelID + '.txt')){
    var aimingAt = fs.readFileSync('./ammo/' + channelID + '.txt', 'utf-8', console.error);
    if (aimingAt == "") {
      aimingAt = [];
    }
    var newArray = JSON.parse(aimingAt);
  }
  else {
    var newArray = [];
  }
  var thisArray = {
    text: msg.content,
    pfp: msg.author.avatarURL(),
    author: msg.author.username,
    sent: msg.createdAt.toLocaleTimeString(msg.author.locale),
    files: msg.attachments.map((files) => files.proxyUrl).join(" ")
  };

  newArray.push(thisArray);

  var proArray = JSON.stringify(newArray);
  fs.writeFile('./ammo/' + channelID + '.txt', proArray, console.error);
}
