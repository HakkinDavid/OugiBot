module.exports =

function (msg) {
  var channelID = msg.channel.id;
  if (fs.existsSync('./ammo/' + channelID + '.txt')){
    var aimingAt = fs.readFileSync('./ammo/' + channelID + '.txt', 'utf-8', console.error);
    if (aimingAt == "") {
      aimingAt = [];
    }
    else if (!aimingAt.startsWith("[{")) {
      aimingAt = [];
    }
    else if (!aimingAt.endsWith("}]")) {
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

  for (i=newArray.length-5; newArray.length > i; i++) {
    if (i>=0 && newArray[i].text == thisArray.text && newArray[i].author == thisArray.author && newArray[i].files == thisArray.files) {
      return
    }
  }

  newArray.push(thisArray);

  var proArray = JSON.stringify(newArray);
  fs.writeFile('./ammo/' + channelID + '.txt', proArray, console.error);
}
