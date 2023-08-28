module.exports =

async function (msg, guild) {
  let anIndex = Math.floor(Math.random()*6);
  let possibleLangs = ["arabic", "french", "spanish", "english", "mexican spanish", "chinese", "japanese"];
  let possibleCodes = ["ar", "fr", "es", "en", "mx", "zh-CN"];
  let embed;
  if (guild) {
    embed = await ougi.helpPreset(msg, "guildlanguage");
    embed.setDescription(await ougi.text(msg, "guildLanguageHelpDesc") + " " + await ougi.text(msg, "possibleLangInput"))
    if (msg.channel.type != "text") {
      embed.addFields({name: await ougi.text(msg, "onlyGuilds"), value: ":warning: " + await ougi.text(msg, "mustGuild")})
    }
    embed.addFields({name: await ougi.text(msg, "specialPermission"), value: ":warning: " + await ougi.text(msg, "onlyOwner")})
    .addFields({name: await ougi.text(msg, "example"), value: "`ougi guildlanguage " + possibleLangs[anIndex] + "`"})
    .addFields({name: await ougi.text(msg, "sameAs"), value: "`ougi guildlanguage " + possibleCodes[anIndex] + "`"})
    .addFields({name: await ougi.text(msg, "output"), value: (await ougi.text(msg, "newLangGuild")).replace(/{langName}/gi, ougi.capitalize(possibleLangs[anIndex]) + " (" + possibleCodes[anIndex] + ")")});
  }
  else {
    embed = await ougi.helpPreset(msg, "language");
    embed.setDescription(await ougi.text(msg, "languageHelpDesc") + " " + await ougi.text(msg, "possibleLangInput"))
    .addFields({name: await ougi.text(msg, "example"), value: "`ougi language " + possibleLangs[anIndex] + "`"})
    .addFields({name: await ougi.text(msg, "sameAs"), value: "`ougi language " + possibleCodes[anIndex] + "`"})
    .addFields({name: await ougi.text(msg, "output"), value: (await ougi.text(msg, "newLang")).replace(/{langName}/gi, ougi.capitalize(possibleLangs[anIndex]) + " (" + possibleCodes[anIndex] + ")")});
  }
  msg.channel.send({embeds: [embed]}).catch(console.error);
}
