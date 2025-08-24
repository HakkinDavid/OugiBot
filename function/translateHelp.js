module.exports =

async function (msg) {
  let potentialPhrase = ["Hola, mi nombre es Ougi.", "こんにちわ、僕の名前はOugiだ。", "Yo no hablo español, sólo finjo hacerlo.", "No eres un Fortniter.", "¿Eres tonto o masticas agua?", "您好，我是Ougi。", "Hallo, ich heiße Ougi."];
  let phrase = potentialPhrase[Math.floor(Math.random()*potentialPhrase.length)];
  translate(phrase, {to: 'en', client: 'gtx'}).then(res => {
    let embed = new Discord.EmbedBuilder()
    .setTitle("Ougi Translate")
    .setColor("#6254E7")
    .addFields({name: "Input in " + ougi.langCodes[res.from.language.iso], phrase})
    .addFields({name: "Translation to English", value: res.text})
    .setFooter({text: "Translated by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougitranslate.png?raw=true");
    msg.channel.send("Is there anything I can translate for you? If so, just provide me a destination language (it can be the language's name or ISO code), followed by whatever you want me to translate.\n**Examples:**\n> ougi translate english " + phrase + "\n> ougi translate en " + phrase, {embeds: [embed]})
  }).catch(err => {
      console.error(err);
  });
}
