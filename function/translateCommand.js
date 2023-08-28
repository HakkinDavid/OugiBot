module.exports =

async function (msg) {
  let spookyCake = msg.content;
  let spookySlices = spookyCake.replace("\n", " ").split(" ");
  let arguments = spookySlices.slice(2);
  if (arguments.length <= 1) {
    msg.channel.send("Please use a valid syntax for the translation. Refer to the following command if you are clueless.\n> ougi help translate").catch(console.error);
    return
  }
  let toLang = arguments[0].toLowerCase().replace("-cn", "-CN").replace("-tw", "-TW");
  let phrase = arguments.slice(1).join(" ");
  if (toLang == "chinese") {
    toLang = "zh-CN"
  }
  else if (toLang == "chinese-s") {
    toLang = "zh-CN"
  }
  else if (toLang == "chinese-t") {
    toLang = "zh-TW"
  }
  let niceLang = ougi.capitalize(toLang);
  let isLang = ougi.whereIs(ougi.langCodes, niceLang);
  let isCode = ougi.langCodes[toLang];
  if (isLang == undefined && isCode == undefined) {
    msg.channel.send("Please provide a valid destination language for the translation. Refer to the following command if you are clueless.\n> ougi help translate").catch(console.error);
    return
  }
  if (isCode != undefined && isLang == undefined) {
    niceLang = isCode;
  }
  let finalCode = ougi.whereIs(ougi.langCodes, niceLang);
  translate(phrase, {to: finalCode, client: 'gtx'}).then(res => {
    let embed = new Discord.EmbedBuilder()
    .setTitle("Ougi Translate")
    .setColor("#6254E7")
    .addFields({name: "Input in " + ougi.langCodes[res.from.language.iso], phrase})
    .addFields({name: "Translation to " + niceLang, value: res.text})
    .setFooter({text: "Translated by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougitranslate.png?raw=true");
    msg.channel.send({embeds: [embed]}).catch(console.error);
  }).catch(err => {
      console.error(err);
  });
}
