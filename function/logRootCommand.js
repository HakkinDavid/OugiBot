module.exports =

function logRootCommand(arguments, msg) {
  var what = arguments[0];
  if (what == "emoji") {
    const emojiList = client.emojis.map((e, x) => (x + ' = ' + e) + ' | ' +e.name).join('\n')
    fs.writeFile('all.emoji', emojiList, console.error);
    msg.channel.send("I've wrote a file called all.emoji containing every single emoji I can use");
  }
  else if (what == "guilds") {
    const guildsList = client.guilds.map((e, x) => (x + ' = ' + e)).join('\n')
    fs.writeFile('all.guilds', guildsList, console.error);
    msg.channel.send("I've wrote a file called all.guilds containing every single guild I'm in");
  }
}
