module.exports =

async function (arguments, msg, guildExecution) {
  let preferencesID = msg.author.id;
  if (guildExecution) {
    if (msg.channel.type != "text") {
      msg.channel.send(await ougi.text(msg, "mustGuild"));
      return
    }
    if (msg.author.id != msg.guild.ownerID) {
      msg.channel.send(await ougi.text(msg, "mustOwn"));
      return
    }
    preferencesID = msg.guild.id;
  }
  let toLang = arguments.join(" ").replace("-cn", "-CN").replace("-tw", "-TW");
  if (toLang == "chinese" || toLang == "chinese-s" || toLang.includes("chinese") && toLang.includes("simplified")) {
    toLang = "zh-CN"
  }
  else if (toLang == "chinese-t" || toLang.includes("chinese") && toLang.includes("traditional")) {
    toLang = "zh-TW"
  }
  else if (toLang.includes("mexican") || toLang.includes("mexico")) {
    toLang = "mx"
  }

  let niceLang = ougi.capitalize(toLang);
  let isLang = ougi.whereIs(ougi.langCodes, niceLang);
  let isCode = ougi.langCodes[toLang];
  if (isLang == undefined && isCode == undefined) {
    msg.channel.send(await ougi.text(msg, "validLang") + "\n> ougi help language").catch(console.error);
    return
  }
  if (isCode != undefined && isLang == undefined) {
    niceLang = isCode;
  }
  let finalCode = ougi.whereIs(ougi.langCodes, niceLang);
  let langEmbed = new Discord.MessageEmbed()
  .setTitle((await ougi.text(msg, "newLang")).replace(/{langName}/gi, niceLang + " (" + finalCode + ")"))
  .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
  .setColor("#32A852")
  .setDescription(await ougi.text(msg, "langDesc"))
  .setFooter("langEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/world.png?raw=true");
  if (finalCode == 'default') {
    langEmbed.setTitle("Language preferences restored to default");
    langEmbed.setDescription("Ougi will talk to you in English.");
  }
  if (guildExecution) {
    langEmbed.setTitle((await ougi.text(msg, "newLangGuild")).replace(/{langName}/gi, niceLang + " (" + finalCode + ")"));
    langEmbed.setDescription((await ougi.text(msg, "langGuildDesc")).replace(/{guildName}/, msg.guild.toString()));
    if (finalCode == 'default') {
      langEmbed.setTitle("Guild language preferences restored to default");
      langEmbed.setDescription("Ougi will use each user's language preferences.");
    }
  }
  langEmbed.addField(":warning: " + await ougi.text(msg, "possibleDelay"), await ougi.text(msg, "delayWarning"))
  msg.channel.send(langEmbed);
  settingsOBJ.lang[preferencesID] = finalCode;
  if (finalCode == 'default') {
    delete settingsOBJ.lang[preferencesID]
  }
  await fs.writeFile('./settings.txt', JSON.stringify(settingsOBJ), console.error);
  ougi.backup('./settings.txt', settingsChannel);
}
