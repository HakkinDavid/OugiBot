module.exports =

async function (msg, guild) {
  let anIndex = Math.floor(Math.random()*6);
  let possibleLangs = ["arabic", "french", "spanish", "english", "mexican spanish", "chinese", "japanese"];
  let possibleCodes = ["ar", "fr", "es", "en", "mx", "zh-CN"];
  let embed;
  if (guild) {
    embed = await ougi.helpPreset(msg, "guildlanguage");
    embed.setDescription(await ougi.text(msg, "guildLanguageHelpDesc"))
    embed.addField(await ougi.text(msg, "onlyGuilds"))
    embed.addField(await ougi.text(msg, "onlyOwner"))
    .addField(await ougi.text(msg, "example"), "`ougi guildlanguage " + possibleLangs[anIndex] + "`")
    .addField(await ougi.text(msg, "sameAs"), "`ougi guildlanguage " + possibleCodes[anIndex] + "`")
    .addField(await ougi.text(msg, "output"), (await ougi.text(msg, "newLangGuild")).replace(/{langName}/gi, ougi.capitalize(possibleLangs[anIndex]) + " (" + possibleCodes[anIndex] + ")"));
  }
  else {
    embed = await ougi.helpPreset(msg, "language");
    embed.setDescription(await ougi.text(msg, "languageHelpDesc"))
    .addField(await ougi.text(msg, "example"), "`ougi language " + possibleLangs[anIndex] + "`")
    .addField(await ougi.text(msg, "sameAs"), "`ougi language " + possibleCodes[anIndex] + "`")
    .addField(await ougi.text(msg, "output"), (await ougi.text(msg, "newLang")).replace(/{langName}/gi, ougi.capitalize(possibleLangs[anIndex]) + " (" + possibleCodes[anIndex] + ")"));
  }
  msg.channel.send({embed}).catch(console.error);
}
