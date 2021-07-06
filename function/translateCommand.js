module.exports =

async function (msg, method) {
  let spookyCake = msg.content;
  let spookySlices = spookyCake.replace("\n", " ").split(" ");
  let spookyCommand = spookySlices[1];
  let arguments = spookySlices.slice(2);
  if (method == 1) {
    if (arguments.length < 1) {
      msg.channel.send("Please use a valid syntax for the translation. Refer to the following command if you are clueless.\n> ougi help translate").catch(console.error);
      return
    }
    var commandAndLang = spookyCommand.toLowerCase().split("-");
    var toLang = commandAndLang.slice(1).join("-").replace("-cn", "-CN").replace("-tw", "-TW");
    var phrase = arguments.join(" ");
  }
  else {
    if (arguments.length <= 1) {
      msg.channel.send("Please use a valid syntax for the translation. Refer to the following command if you are clueless.\n> ougi help translate").catch(console.error);
      return
    }
    var toLang = arguments[0].toLowerCase().replace("-cn", "-CN").replace("-tw", "-TW");
    var phrase = arguments.slice(1).join(" ");
  }
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
  translate(phrase, {to: finalCode}).then(res => {
    var embed = new Discord.MessageEmbed()
    .setTitle("Ougi Translate")
    .setColor("#6254E7")
    .addField("Input in " + ougi.langCodes[res.from.language.iso], phrase)
    .addField("Translation to " + niceLang, res.text)
    .setFooter("Translated by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougitranslate.png?raw=true");
    msg.channel.send({embed}).catch(console.error);
  }).catch(err => {
      console.error(err);
  });
}
