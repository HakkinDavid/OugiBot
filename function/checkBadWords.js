module.exports =

function checkBadWords(arguments, msg) {
  var badWord = ["nigga", "faggot", "fuck", "nigger", "baka", "stupid", "dumb", "idiot", "hentai", "shit", "fucking", "silly", "ass", "retard", "whore", "gay"];
  var insultos = ["joto", "puto", "estúpido", "verga", "pendejo", "pendeja", "idiota", "mierda", "tonto", "retrasado", "chupa", "pito", "chinga"];
  for (var i = 0; i < badWord.length; i++) {
      if (msg.content.includes(badWord[i])) {
        var options = ["no u", "you're a bad word", "then you uhhhhh you're a fortniter", "<:nou:721293082716274719>", "<:reverse:721293982134698004>"];
        var response = options[Math.floor(Math.random()*options.length)];
        msg.channel.send(response).then().catch(console.error);
        console.log("**Replied**\n> " + response);
        var insutedBack = 1;
        break;
      }
      else if (msg.content.includes(insultos[i])) {
        var options = ["la tuya por si acaso", "tu existencia es un insulto a la humanidad", "entonces no eres un verdadero fortniter", "<:nou:721293082716274719>", "<:reverse:721293982134698004>"];
        var response = options[Math.floor(Math.random()*options.length)];
        msg.channel.send(response).then().catch(console.error);
        console.log("**Replied**\n> " + response);
        var insutedBack = 1;
        break;
      }
  }
  if (!insutedBack) {
    ougi.mimicAbility(msg);
  }
}
