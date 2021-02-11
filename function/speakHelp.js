module.exports =

async function (msg) {
  let examplePhrases = ["never gonna give you up", "wait, that's illegal", "what is love? baby don't hurt me", "this is not ASMR"];
  let examplePhrases2 = ["ora ora ora ora", "muda muda muda muda", "dorararararara", "shitsurei, kamimashita", "arararagi-senpai", "hazukashii"];
  let embed = await ougi.helpPreset(msg, "speak");
  embed.setDescription((await ougi.text(msg, "speakHelpDesc")).replace(/{c}/gi, "`guildlanguage`"))
  .addField(await ougi.text(msg, "example"), "`ougi speak " + examplePhrases[Math.floor(Math.random()*examplePhrases.length)] + "`")
  .addField(await ougi.text(msg, "speakSpecificLang"), "`ougi speak ::ja " + examplePhrases2[Math.floor(Math.random()*examplePhrases2.length)] + "`")

  msg.channel.send({embed}).catch(console.error);
}
