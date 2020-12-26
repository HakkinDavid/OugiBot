module.exports =

async function (arguments, msg) {
  var what = arguments[0];
  if (what == "emoji") {
    var emojiList = client.emojis.cache.map((e, x) => (x + ' = ' + e) + ' | ' + e.name);
    var logFileName = "allEmoji.txt";
    fs.writeFileSync(logFileName, emojiList.join('\n'), console.error);
    const attachment = new Discord.MessageAttachment(logFileName);

    client.channels.cache.get(fileSpace).send("__**Emoji:**__ " + emojiList.length, attachment).then().catch(console.error);
    msg.channel.send("I've written a file containing every single emoji I can use.").then().catch(console.error);
  }
  else if (what == "guilds") {
    var guildsList = client.guilds.cache.map((e, x) => (x + ' = ' + e));
    var logFileName = "allGuilds.txt";
    fs.writeFileSync(logFileName, guildsList.join('\n'), console.error);
    const attachment = new Discord.MessageAttachment(logFileName);

    client.channels.cache.get(fileSpace).send("__**Guilds:**__ " + guildsList.length, attachment).then().catch(console.error);
    msg.channel.send("I've written a file containing every single guild I'm in.").then().catch(console.error);
  }
}
