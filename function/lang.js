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
  let langNames = {
      'default': 'Default',
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
      'mx': 'Mexican Spanish',
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
  let niceLang = ougi.capitalize(toLang);
  let isLang = ougi.whereIs(langNames, niceLang);
  let isCode = langNames[toLang];
  if (isLang == undefined && isCode == undefined) {
    msg.channel.send(await ougi.text(msg, "validLang") + "\n> ougi help language").then().catch(console.error);
    return
  }
  if (isCode != undefined && isLang == undefined) {
    niceLang = isCode;
  }
  let finalCode = ougi.whereIs(langNames, niceLang);
  let langEmbed = new Discord.MessageEmbed()
  .setTitle(await ougi.text(msg, "newLang") + " " + niceLang + " (" + finalCode + ")")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#32A852")
  .setDescription(await ougi.text(msg, "langDesc"))
  .setFooter("langEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/world.png?raw=true");
  if (finalCode == 'default') {
    langEmbed.setTitle("Language preferences restored to default");
    langEmbed.setDescription("Ougi will talk to you in English.");
  }
  if (guildExecution) {
    langEmbed.setTitle(await ougi.text(msg, "newLangGuild") + " " + niceLang + " (" + finalCode + ")");
    langEmbed.setDescription(await ougi.text(msg, "langGuildDesc") + " " + msg.guild.toString() + ".");
    if (finalCode == 'default') {
      langEmbed.setTitle("Guild language preferences restored to default");
      langEmbed.setDescription("Ougi will use each user's language preferences.");
    }
  }
  langEmbed.addField(":warning: " + await ougi.text(msg, "possibleDelay"), await ougi.text(msg, "delayWarning"))
  msg.channel.send(langEmbed);
  let pseudoArray = JSON.parse(fs.readFileSync('./settings.txt'));
  pseudoArray.lang[preferencesID] = finalCode;
  if (finalCode == 'default') {
    delete pseudoArray.lang[preferencesID]
  }
  await fs.writeFile('./settings.txt', JSON.stringify(pseudoArray), console.error);
  ougi.backup('./settings.txt', settingsChannel);
}
