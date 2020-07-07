module.exports =

function loadSniper(msg) {
  var channelID = msg.channel.id;
  var pseudoArray = JSON.parse(fs.readFileSync('./aimAssist.txt', 'utf-8', console.error));
  if (pseudoArray.includes(channelID)){
    var newArray = JSON.parse(fs.readFileSync('./ammo/' + channelID + '.txt', 'utf-8', console.error));
  }
  else {
    var newArray = [];
    pseudoArray.push(msg.channel.id);
    var updateArray = JSON.stringify(pseudoArray);
    fs.writeFile('./aimAssist.txt', updateArray, console.error);
  }

    var thisArray = {
      text: msg.content,
      pfp: msg.author.avatarURL,
      author: msg.author.username,
      sent: msg.createdAt.toLocaleTimeString(msg.author.locale),
      files: msg.attachments.map((files) => files.proxyUrl).join(" ")
    };

    newArray.push(thisArray);

    var proArray = JSON.stringify(newArray);
    fs.writeFile('./ammo/' + channelID + '.txt', proArray, console.error);
}
