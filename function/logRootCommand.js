module.exports =

function logRootCommand(arguments, msg) {
  var what = arguments[0];
  if (what == "emoji") {
    var emojiList = client.emojis.map((e, x) => (x + ' = ' + e) + ' | ' +e.name).join('\n');
    var logFileName = "allEmoji.txt";
    fs.writeFile(logFileName, emojiList, console.error);
    const attachment = new Discord.Attachment(logFileName);

    client.channels.get(fileSpace).send(attachment).then().catch(console.error);
    msg.channel.send("I've written a file containing every single emoji I can use.").then().catch(console.error);
  }
  else if (what == "guilds") {
    var guildsList = client.guilds.map((e, x) => (x + ' = ' + e)).join('\n');
    var logFileName = "allGuilds.txt";
    fs.writeFile(logFileName, guildsList, console.error);
    const attachment = new Discord.Attachment(logFileName);

    client.channels.get(fileSpace).send(attachment).then().catch(console.error);
    msg.channel.send("I've written a file containing every single guild I'm in.").then().catch(console.error);
  }
}
