module.exports =

async function (arguments, msg) {
  let what = arguments[0];
  if (what == "emoji") {
    let emojiList = client.emojis.cache.map((e, x) => (x + ' = ' + e) + ' | ' + e.name);
    let logFileName = "allEmoji.txt";
    await fs.writeFile(logFileName, emojiList.join('\n'), console.error);
    let attachment = new Discord.MessageAttachment(logFileName);

    client.channels.cache.get(fileSpace).send("__**Emoji:**__ " + emojiList.length, attachment).catch(console.error);
    msg.channel.send("I've written a file containing every single emoji I can use.").catch(console.error);
  }
  else if (what == "guilds") {
    let guildsList = client.guilds.cache.map((g) => g.toString() + " with a total of " + g.memberCount + " users");
    let logFileName = "allGuilds.txt";
    await fs.writeFile(logFileName, guildsList.join('\n'), console.error);
    let attachment = new Discord.MessageAttachment(logFileName);

    client.channels.cache.get(fileSpace).send("__**Guilds:**__ " + guildsList.length, attachment).catch(console.error);
    msg.channel.send("I've written a file containing every single guild I'm in.").catch(console.error);
  }
}
