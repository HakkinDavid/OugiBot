module.exports =

async function (arguments, msg, guildExecution) {
  let preferencesID = msg.author.id;
  if (guildExecution) {
    if (!(await ougi.guildCheck(msg))) return;
    if (!(await ougi.adminCheck(msg))) return;
    preferencesID = msg.guildId;
  }
  let toLang = arguments.join(" ");
  if (toLang == "chinese" || toLang == "chinese-s" || toLang.includes("chinese") && toLang.includes("simplified")) {
    toLang = "zh-cn"
  }
  else if (toLang == "chinese-t" || toLang.includes("chinese") && toLang.includes("traditional")) {
    toLang = "zh-tw"
  }
  else if (toLang.includes("mexican") || toLang.includes("mexico")) {
    toLang = "mx"
  }

  let niceLang = ougi.capitalize(toLang);
  let isLang = ougi.whereIs(ougi.langCodes, niceLang);
  let isCode = ougi.langCodes[toLang];
  if (isLang == undefined && isCode == undefined) {
    msg.channel.send(await ougi.text({ msg, stringID: "validLang" }) + "\n> ougi help language").catch(console.error);
    return
  }
  if (isCode != undefined && isLang == undefined) {
    niceLang = isCode;
  }
  let finalCode = ougi.whereIs(ougi.langCodes, niceLang);
  let langEmbed = new Discord.EmbedBuilder()
  .setTitle(await ougi.text({ msg, stringID: "newLang", values: { langName: niceLang + " (" + finalCode + ")" } }))
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#32A852")
  .setDescription(await ougi.text({ msg, stringID: "langDesc" }))
  .setFooter({text: "langEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/world.png?raw=true");
  if (finalCode == 'default') {
    langEmbed.setTitle(await ougi.text({ msg, stringID: "lang_restoredDefaultTitle" }));
    langEmbed.setDescription(await ougi.text({ msg, stringID: "lang_restoredDefaultDesc" }));
  }
  if (guildExecution) {
    langEmbed.setTitle(await ougi.text({ msg, stringID: "newLangGuild", values: { langName: niceLang + " (" + finalCode + ")" } }));
    langEmbed.setDescription(await ougi.text({ msg, stringID: "langGuildDesc", values: { guildName: msg.guild.toString() } }));
    if (finalCode == 'default') {
      langEmbed.setTitle(await ougi.text({ msg, stringID: "lang_guildRestoredDefaultTitle" }));
      langEmbed.setDescription(await ougi.text({ msg, stringID: "lang_guildRestoredDefaultDesc" }));
    }
  }
  langEmbed.addFields({name: ":warning: " + await ougi.text({ msg, stringID: "possibleDelay" }), value: await ougi.text({ msg, stringID: "delayWarning" })});
  msg.channel.send({embeds: [langEmbed]});
  ougi.db().setLang(preferencesID, finalCode);
}
