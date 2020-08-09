module.exports =

function (msg) {
  var potentialPhrase = ["Hola, mi nombre es Ougi.", "こんにちわ、僕の名前はOugiだ。", "Yo no hablo español, sólo finjo hacerlo.", "No eres un Fortniter.", "¿Eres tonto o masticas agua?", "您好，我是Ougi。", "Hallo, ich heiße Ougi."];
  var phrase = potentialPhrase[Math.floor(Math.random()*potentialPhrase.length)];
  var langNames = {
    'ja': 'Japanese',
    'es': 'Spanish',
    'zh-CN': 'Chinese (Simplified)',
    'zh-TW': 'Chinese (Traditional)',
    'de': 'German'
  }
  translate(phrase, {to: "English"}).then(res => {
    var embed = new Discord.MessageEmbed()
    .setTitle("Ougi Translate")
    .setColor("#6254E7")
    .addField("Input in " + langNames[res.from.language.iso], phrase)
    .addField("Translation to English", res.text)
    .setFooter("Translated by Ougi", client.user.avatarURL())
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougitranslate.png?raw=true");
    msg.channel.send("Is there anything I can translate for you? If so, just provide me a destination language (it can be the language's name or ISO code), followed by whatever you want me to translate.\n**Examples:** *(All of these have the same output.)*\n> ougi translate english " + phrase + "\n> ougi translate-english " + phrase + "\n> ougi translate en " + phrase + "\n> ougi translate-en " + phrase, {embed})
  }).catch(err => {
      console.error(err);
  });
}
