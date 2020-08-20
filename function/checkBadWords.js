module.exports =

function (msg) {
  var embed = new Discord.MessageEmbed()
  .setTitle("checkBadWords")
  .setColor("#FF008C")
  .setFooter("globalLogEmbed by Ougi", client.user.avatarURL());
  var badWord = ["nigga", "faggot", "fuck", "nigger", "baka", "stupid", "dumb", "idiot", "hentai", "shit", "fucking", "silly", "ass", "retard", "whore", "gay"];
  var insultos = ["joto", "puto", "estúpido", "verga", "pendejo", "pendeja", "idiota", "mierda", "tonto", "retrasado", "chupa", "pito", "chinga"];
  for (var i = 0; i < badWord.length; i++) {
      if (msg.content.includes(badWord[i])) {
        var options = ["no u", "you're a bad word", "then you uhhhhh you're a fortniter", "<:nou:726944701348970496>", "<:reverse:726944329754476614>"];
        var iSaid = options[Math.floor(Math.random()*options.length)];
        msg.channel.send(iSaid).then().catch(console.error);
        embed.addField("Replied", iSaid);
        client.channels.cache.get(consoleLogging).send(embed);
        var insutedBack = 1;
        break;
      }
      else if (msg.content.includes(insultos[i])) {
        var options = ["la tuya por si acaso", "tu existencia es un insulto a la humanidad", "entonces no eres un verdadero fortniter", "<:nou:726944701348970496>", "<:reverse:726944329754476614>"];
        var iSaid = options[Math.floor(Math.random()*options.length)];
        msg.channel.send(iSaid).then().catch(console.error);
        embed.addField("Replied", iSaid);
        client.channels.cache.get(consoleLogging).send(embed);
        var insutedBack = 1;
        break;
      }
  }
  if (!insutedBack) {
    if (msg.content.includes("¿")) {
      ougi.respondeComando(arguments, msg);
      return
    }
    if (msg.content.includes("?")) {
      ougi.answerCommand(arguments, msg);
      return
    }
    ougi.mimicAbility(msg);
  }
}
