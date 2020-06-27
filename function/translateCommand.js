module.exports =

function translateCommand(msg, method) {
  var spookyCake = msg.content;
  var spookySlices = spookyCake.replace("\n", " ").split(" ");
  var spookyCommand = spookySlices[1];
  var arguments = spookySlices.slice(2);
  if (method == 1) {
    if (arguments.length < 1) {
      msg.channel.send("Please use a valid syntax for the translation. Refer to the following command if you are clueless.\n> ougi help translate").then().catch(console.error);
      return
    }
    var commandAndLang = spookyCommand.toLowerCase().split("-");
    var toLang = commandAndLang.slice(1).join("-").replace("-cn", "-CN").replace("-tw", "-TW");
    var phrase = arguments.join(" ");
  }
  else {
    if (arguments.length <= 1) {
      msg.channel.send("Please use a valid syntax for the translation. Refer to the following command if you are clueless.\n> ougi help translate").then().catch(console.error);
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
  var langNames = {
      'auto': 'Automatic',
      'af': 'Afrikaans',
      'sq': 'Albanian',
      'am': 'Amharic',
      'ar': 'Arabic',
      'hy': 'Armenian',
      'az': 'Azerbaijani',
      'eu': 'Basque',
      'be': 'Belarusian',
      'bn': 'Bengali',
      'bs': 'Bosnian',
      'bg': 'Bulgarian',
      'ca': 'Catalan',
      'ceb': 'Cebuano',
      'ny': 'Chichewa',
      'zh-CN': 'Chinese (Simplified)',
      'zh-TW': 'Chinese (Traditional)',
      'co': 'Corsican',
      'hr': 'Croatian',
      'cs': 'Czech',
      'da': 'Danish',
      'nl': 'Dutch',
      'en': 'English',
      'eo': 'Esperanto',
      'et': 'Estonian',
      'tl': 'Filipino',
      'fi': 'Finnish',
      'fr': 'French',
      'fy': 'Frisian',
      'gl': 'Galician',
      'ka': 'Georgian',
      'de': 'German',
      'el': 'Greek',
      'gu': 'Gujarati',
      'ht': 'Haitian Creole',
      'ha': 'Hausa',
      'haw': 'Hawaiian',
      'he': 'Hebrew',
      'iw': 'Hebrew',
      'hi': 'Hindi',
      'hmn': 'Hmong',
      'hu': 'Hungarian',
      'is': 'Icelandic',
      'ig': 'Igbo',
      'id': 'Indonesian',
      'ga': 'Irish',
      'it': 'Italian',
      'ja': 'Japanese',
      'jw': 'Javanese',
      'kn': 'Kannada',
      'kk': 'Kazakh',
      'km': 'Khmer',
      'ko': 'Korean',
      'ku': 'Kurdish (Kurmanji)',
      'ky': 'Kyrgyz',
      'lo': 'Lao',
      'la': 'Latin',
      'lv': 'Latvian',
      'lt': 'Lithuanian',
      'lb': 'Luxembourgish',
      'mk': 'Macedonian',
      'mg': 'Malagasy',
      'ms': 'Malay',
      'ml': 'Malayalam',
      'mt': 'Maltese',
      'mi': 'Maori',
      'mr': 'Marathi',
      'mn': 'Mongolian',
      'my': 'Myanmar (Burmese)',
      'ne': 'Nepali',
      'no': 'Norwegian',
      'ps': 'Pashto',
      'fa': 'Persian',
      'pl': 'Polish',
      'pt': 'Portuguese',
      'pa': 'Punjabi',
      'ro': 'Romanian',
      'ru': 'Russian',
      'sm': 'Samoan',
      'gd': 'Scots Gaelic',
      'sr': 'Serbian',
      'st': 'Sesotho',
      'sn': 'Shona',
      'sd': 'Sindhi',
      'si': 'Sinhala',
      'sk': 'Slovak',
      'sl': 'Slovenian',
      'so': 'Somali',
      'es': 'Spanish',
      'su': 'Sundanese',
      'sw': 'Swahili',
      'sv': 'Swedish',
      'tg': 'Tajik',
      'ta': 'Tamil',
      'te': 'Telugu',
      'th': 'Thai',
      'tr': 'Turkish',
      'uk': 'Ukrainian',
      'ur': 'Urdu',
      'uz': 'Uzbek',
      'vi': 'Vietnamese',
      'cy': 'Welsh',
      'xh': 'Xhosa',
      'yi': 'Yiddish',
      'yo': 'Yoruba',
      'zu': 'Zulu'
  };
  var niceLang = ougi.capitalize(toLang);
  var isLang = ougi.whereIs(langNames, niceLang);
  var isCode = langNames[toLang];
  if (isLang == undefined && isCode == undefined) {
    msg.channel.send("Please provide a valid destination language for the translation. Refer to the following command if you are clueless.\n> ougi help translate").then().catch(console.error);
    return
  }
  if (isCode != undefined && isLang == undefined) {
    niceLang = isCode;
  }
  translate(phrase, {to: toLang}).then(res => {
    var embed = new Discord.RichEmbed()
    .setTitle("Ougi Translate")
    .setColor("#6254E7")
    .addField("Input in " + langNames[res.from.language.iso], phrase)
    .addField("Translation to " + niceLang, res.text)
    .setFooter("Translated by Ougi", client.user.avatarURL)
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougitranslate.png?raw=true");
    msg.channel.send({embed}).then().catch(console.error);
  }).catch(err => {
      console.error(err);
  });
}
