module.exports =

async function (msg, guild) {
  let anIndex = Math.floor(Math.random()*6);
  let possibleLangs = ["arabic", "french", "spanish", "english", "mexican spanish", "chinese", "japanese"];
  let possibleCodes = ["ar", "fr", "es", "en", "mx", "zh-CN"];
  let embed;
  if (guild) {
    embed = await ougi.helpPreset(msg, "guildlanguage");
    embed.setDescription(await ougi.text({ msg, stringID: "guildLanguageHelpDesc" }) + " " + await ougi.text({ msg, stringID: "possibleLangInput" }))
    if (msg.channel.type !== Discord.ChannelType.GuildText) {
      embed.addFields({name: await ougi.text({ msg, stringID: "onlyGuilds" }), value: ":warning: " + await ougi.text({ msg, stringID: "mustGuild" })})
    }
    embed.addFields({name: await ougi.text({ msg, stringID: "specialPermission" }), value: ":warning: " + await ougi.text({ msg, stringID: "onlyOwner" })})
    .addFields({name: await ougi.text({ msg, stringID: "example" }), value: "`ougi guildlanguage " + possibleLangs[anIndex] + "`"})
    .addFields({name: await ougi.text({ msg, stringID: "sameAs" }), value: "`ougi guildlanguage " + possibleCodes[anIndex] + "`"})
    .addFields({name: await ougi.text({ msg, stringID: "output" }), value: await ougi.text({ msg, stringID: "newLangGuild", values: { langName: ougi.capitalize(possibleLangs[anIndex]) + " (" + possibleCodes[anIndex] + ")" } })});
  }
  else {
    embed = await ougi.helpPreset(msg, "language");
    embed.setDescription(await ougi.text({ msg, stringID: "languageHelpDesc" }) + " " + await ougi.text({ msg, stringID: "possibleLangInput" }))
    .addFields({name: await ougi.text({ msg, stringID: "example" }), value: "`ougi language " + possibleLangs[anIndex] + "`"})
    .addFields({name: await ougi.text({ msg, stringID: "sameAs" }), value: "`ougi language " + possibleCodes[anIndex] + "`"})
    .addFields({name: await ougi.text({ msg, stringID: "output" }), value: await ougi.text({ msg, stringID: "newLang", values: { langName: ougi.capitalize(possibleLangs[anIndex]) + " (" + possibleCodes[anIndex] + ")" } })});
  }
  msg.channel.send({embeds: [embed]}).catch(console.error);
}
