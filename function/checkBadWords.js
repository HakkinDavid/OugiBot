module.exports =

function checkBadWords(arguments, msg) {
  var badWord = ["nigga", "faggot", "fuck", "nigger", "baka", "stupid", "dumb", "hentai", "shit", "fucking", "idiot", "silly", "ass", "retard", "whore", "gay"]
  for (var i = 0; i < badWord.length; i++) {
      if (msg.content.includes(badWord[i])) {
        var options = ["no u", "you're a bad word", "then you uhhhhh you're a fortniter", "<:nou:638908430899478540>", "<:reverse:638908430878507018>"];
        var response = options[Math.floor(Math.random()*options.length)];
        msg.channel.send(response).then().catch(console.error);
        break;
      }
  }
}
