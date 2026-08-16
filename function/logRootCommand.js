module.exports =

async function (arguments, msg) {
  let what = arguments[0];
  if (what == "emoji") {
    let emojiList = client.emojis.cache.map((e, x) => (x + ' = ' + e) + ' | ' + e.name);
    let logFileName = "allEmoji.txt";
    await ougi.writeFile(logFileName, emojiList.join('\n'), console.error);
    let attachment = new Discord.AttachmentBuilder(logFileName);

    client.channels.cache.get(channels.fileSpace).send({ content: "__**Emoji:**__ " + emojiList.length, files: [attachment] }).catch(console.error);
    msg.channel.send(await ougi.text({ lang: 'en', stringID: "root_logWrittenEmoji" })).catch(console.error);
  }
  else if (what == "guilds") {
    let guildsList = client.guilds.cache.map((g) => g.toString() + " with a total of " + g.memberCount + " users");
    let logFileName = "allGuilds.txt";
    await ougi.writeFile(logFileName, guildsList.join('\n'), console.error);
    let attachment = new Discord.AttachmentBuilder(logFileName);

    client.channels.cache.get(channels.fileSpace).send({ content: "__**Guilds:**__ " + guildsList.length, files: [attachment] }).catch(console.error);
    msg.channel.send(await ougi.text({ lang: 'en', stringID: "root_logWrittenGuilds" })).catch(console.error);
  }
}
