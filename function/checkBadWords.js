module.exports =

  async function (msg, replied_to_ougi) {
    let embed = new Discord.EmbedBuilder()
      .setTitle(await ougi.text({ lang: 'en', stringID: "log_wordFilterTitle" }))
      .setColor("#FF008C")
      .setFooter({ text: await ougi.text({ lang: 'en', stringID: "log_globalEmbedFooter" }), icon: client.user.avatarURL({ dynamic: true, size: 4096 }) });
    let badWord = ["nigga", "faggot", "fuck", "nigger", "baka", "stupid", "dumb", "idiot", "hentai", "shit", "fucking", "silly", "ass", "retard", "whore", "gay"];
    let insultos = ["joto", "puto", "estúpido", "verga", "pendejo", "pendeja", "idiota", "mierda", "tonto", "retrasado", "chupa", "pito", "chinga"];
    for (i = 0; i < badWord.length; i++) {
      if (msg.content.includes(badWord[i])) {
        let options = [
          await ougi.text({ msg, stringID: "badwords_resp1" }),
          await ougi.text({ msg, stringID: "badwords_resp2" }),
          await ougi.text({ msg, stringID: "badwords_resp3" }),
          "<:nou:726944701348970496>",
          "<:reverse:726944329754476614>"
        ];
        let iSaid = options[Math.floor(Math.random() * options.length)];
        if (replied_to_ougi) { msg.reply(iSaid).catch(console.error); }
        else { msg.channel.send(iSaid).catch(console.error); }
        embed.addFields({ name: await ougi.text({ lang: 'en', stringID: "log_wordFilterReplied" }), value: iSaid });
        client.channels.cache.get(consoleLogging).send({ embeds: [embed] });
        var insutedBack = 1;
        break;
      }
      else if (msg.content.includes(insultos[i])) {
        let options = [
          await ougi.text({ msg, stringID: "badwords_es_resp1" }),
          await ougi.text({ msg, stringID: "badwords_es_resp2" }),
          await ougi.text({ msg, stringID: "badwords_es_resp3" }),
          "<:nou:726944701348970496>",
          "<:reverse:726944329754476614>"
        ];
        let iSaid = options[Math.floor(Math.random() * options.length)];
        if (replied_to_ougi) { msg.reply(iSaid).catch(console.error); }
        else { msg.channel.send(iSaid).catch(console.error); }
        embed.addFields({ name: await ougi.text({ lang: 'en', stringID: "log_wordFilterReplied" }), value: iSaid });
        client.channels.cache.get(consoleLogging).send({ embeds: [embed] });
        var insutedBack = 1;
        break;
      }
    }
    if (!insutedBack) {
      if (msg.content.includes("?")) {
        await ougi.answerCommand(msg, replied_to_ougi);
        return
      }
      await ougi.mimicAbility(msg, replied_to_ougi);
    }
  }
