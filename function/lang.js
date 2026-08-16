module.exports =

async function (arguments, msg, guildExecution) {
  let preferencesID = msg.author.id;
  if (guildExecution) {
    if (!(await ougi.guildCheck(msg))) return;
    if (!(await ougi.adminCheck(msg))) return;
    preferencesID = msg.guildId;
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
  let langEmbed = new Discord.EmbedBuilder()
  .setTitle((await ougi.text(msg, "newLang")).replace(/{langName}/gi, niceLang + " (" + finalCode + ")"))
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#32A852")
  .setDescription(await ougi.text(msg, "langDesc"))
  .setFooter({text: "langEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/world.png?raw=true");
  if (finalCode == 'default') {
    langEmbed.setTitle(await ougi.text(msg, "lang_restoredDefaultTitle"));
    langEmbed.setDescription(await ougi.text(msg, "lang_restoredDefaultDesc"));
  }
  if (guildExecution) {
    langEmbed.setTitle((await ougi.text(msg, "newLangGuild")).replace(/{langName}/gi, niceLang + " (" + finalCode + ")"));
    langEmbed.setDescription((await ougi.text(msg, "langGuildDesc")).replace(/{guildName}/, msg.guild.toString()));
    if (finalCode == 'default') {
      langEmbed.setTitle(await ougi.text(msg, "lang_guildRestoredDefaultTitle"));
      langEmbed.setDescription(await ougi.text(msg, "lang_guildRestoredDefaultDesc"));
    }
  }
  langEmbed.addFields({name: ":warning: " + await ougi.text(msg, "possibleDelay"), value: await ougi.text(msg, "delayWarning")})
  msg.channel.send({embeds: [langEmbed]});
  ougi.db().setLang(preferencesID, finalCode);
}
