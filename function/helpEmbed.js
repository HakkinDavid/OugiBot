module.exports =

async function (msg) {
  let commandsArray = ["say", "answer", "image", "translate", "music", "snipe", "embed", "learn", "emoji", "emoji-list"];
  let embed = await ougi.helpPreset(msg);
  embed.setTitle(await ougi.text(msg, "helpTitle"))
  .setDescription(await ougi.text(msg, "helpDesc"))
  .addFields({name: await ougi.text(msg, "helpPrefix"), value: "`ougi`\n" + await ougi.text(msg, "helpPrefixExplanation")})
  .addFields({name: await ougi.text(msg, "availableCommands"), value: await ougi.text(msg, "availableCommandsList") + ": `say`, `answer`, `image`, `translate`, `dice`, `recipe`, `editsnipe`, `survey`, `skip`, `curl`, `snipe`, `speak`, `news`, `stats`, `embed`, `tweet`, `learn`, `forget`, `emoji`, `emoji-list`, `language`, `guildlanguage`, `newspaper`, `subscribe`, `unsubscribe`, `prefix`, `blacklist`, `allow`, `setnews`, `setlog`, `info`. " + await ougi.text(msg, "improving")})
  // pandemic ptsd .addFields({name: "<:COVID19:820957937840816140> " + await ougi.text(msg, "featuredCOVID19modules"), await ougi.text(msg, "availableCommandsListCOVID19") + "\n• `covidnews` - " + await ougi.text(msg, "covidnewsDesc") + "\n• `healthcare` - " + await ougi.text(msg, "healthcareDesc") + "\n• `md` - " + await ougi.text(msg, "medicalDefinitionDesc") + "\n• `covidstats` - " + await ougi.text(msg, "covidStatsDesc")})
  .addFields({name: await ougi.text(msg, "privacyPolicy") + "\n\u200b", value: (await ougi.text(msg, "remindLang")).replace(/{c1}/gi, "`ougi language [lang]`").replace(/{c2}/gi, "`ougi help [command]`")});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
