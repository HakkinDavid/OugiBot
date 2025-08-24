module.exports =

  function (msg, replied_to_ougi) {
    let embed = new Discord.EmbedBuilder()
      .setTitle("checkBadWords")
      .setColor("#FF008C")
      .setFooter({ text: "globalLogEmbed by Ougi", icon: client.user.avatarURL({ dynamic: true, size: 4096 }) });
    let badWord = ["nigga", "faggot", "fuck", "nigger", "baka", "stupid", "dumb", "idiot", "hentai", "shit", "fucking", "silly", "ass", "retard", "whore", "gay"];
    let insultos = ["joto", "puto", "estúpido", "verga", "pendejo", "pendeja", "idiota", "mierda", "tonto", "retrasado", "chupa", "pito", "chinga"];
    for (i = 0; i < badWord.length; i++) {
      if (msg.content.includes(badWord[i])) {
        let options = ["no u", "you're a bad word", "then you uhhhhh you're a fortniter", "<:nou:726944701348970496>", "<:reverse:726944329754476614>"];
        let iSaid = options[Math.floor(Math.random() * options.length)];
        if (replied_to_ougi) { msg.reply(iSaid).catch(console.error); }
        else { msg.channel.send(iSaid).catch(console.error); }
        embed.addFields({ name: "Replied", value: iSaid });
        client.channels.cache.get(consoleLogging).send({ embeds: [embed] });
        var insutedBack = 1;
        break;
      }
      else if (msg.content.includes(insultos[i])) {
        let options = ["la tuya por si acaso", "tu existencia es un insulto a la humanidad", "entonces no eres un verdadero fortniter", "<:nou:726944701348970496>", "<:reverse:726944329754476614>"];
        let iSaid = options[Math.floor(Math.random() * options.length)];
        if (replied_to_ougi) { msg.reply(iSaid).catch(console.error); }
        else { msg.channel.send(iSaid).catch(console.error); }
        embed.addFields({ name: "Replied", value: iSaid });
        client.channels.cache.get(consoleLogging).send({ embeds: [embed] });
        var insutedBack = 1;
        break;
      }
    }
    if (!insutedBack) {
      if (msg.content.includes("?")) {
        ougi.answerCommand(msg, replied_to_ougi);
        return
      }
      ougi.mimicAbility(msg, replied_to_ougi);
    }
  }
