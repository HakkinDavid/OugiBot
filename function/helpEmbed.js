module.exports =

async function (msg) {
  let commandsArray = ["say", "answer", "image", "translate", "music", "snipe", "embed", "learn", "emoji", "emoji-list"];
  let embed = await ougi.helpPreset(msg);
  embed.setTitle(await ougi.text(msg, "helpTitle"))
  .setDescription(await ougi.text(msg, "helpDesc"))
  .addField(await ougi.text(msg, "helpPrefix"), "`ougi`\n" + await ougi.text(msg, "helpPrefixExplanation"))
  .addField(await ougi.text(msg, "helpHelpCommand") + ": `help`", await ougi.text(msg, "helpHelpExplanation") + "\n**" + await ougi.text(msg, "example") + ":**\n`ougi help " + commandsArray[Math.floor(Math.random()*commandsArray.length)] + "`")
  .addField(await ougi.text(msg, "availableCommands"), await ougi.text(msg, "availableCommandsList") + ": `say`, `answer`, `image`, `translate`, `music`, `skip`, `lyrics`, `curl`, `snipe`, `speak`, `stats`, `embed`, `tweet`, `learn`, `forget`, `emoji`, `emoji-list`, `language`, `guildlanguage`, `newspaper`, `subscribe`, `unsubscribe`, `prefix`, `blacklist`, `allow`, `setnews`, `setlog`, `acknowledgement`, `info`. " + await ougi.text(msg, "improving"));

  msg.channel.send({embed}).catch(console.error);
}
