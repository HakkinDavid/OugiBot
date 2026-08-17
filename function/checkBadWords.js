module.exports = async function (msg, replied_to_ougi) {
    const avatar = client.user.displayAvatarURL({ dynamic: true, size: 4096 });
    let embed = new Discord.EmbedBuilder()
      .setTitle(await ougi.text({ lang: 'en', stringID: "log_wordFilterTitle" }) || "Word Filter Triggered")
      .setColor("#FF008C")
      .setFooter({ text: await ougi.text({ lang: 'en', stringID: "log_globalEmbedFooter" }) || "Global Log", iconURL: avatar });

    const lower = msg.content.toLowerCase();
    const badWords = ["nigga", "faggot", "fuck", "nigger", "baka", "stupid", "dumb", "idiot", "hentai", "shit", "fucking", "silly", "ass", "retard", "whore", "gay"];
    const insultos = ["joto", "puto", "estúpido", "verga", "pendejo", "pendeja", "idiota", "mierda", "tonto", "retrasado", "chupa", "pito", "chinga"];

    let insultedBack = false;

    for (const word of badWords) {
      if (lower.includes(word)) {
        let options = [
          await ougi.text({ msg, stringID: "badwords_resp1" }),
          await ougi.text({ msg, stringID: "badwords_resp2" }),
          await ougi.text({ msg, stringID: "badwords_resp3" }),
          "<:nou:726944701348970496>",
          "<:reverse:726944329754476614>"
        ];
        let iSaid = options[Math.floor(Math.random() * options.length)];
        if (replied_to_ougi && msg.reply) { msg.reply(iSaid).catch(console.error); }
        else if (msg.channel?.send) { msg.channel.send(iSaid).catch(console.error); }
        embed.addFields({ name: await ougi.text({ lang: 'en', stringID: "log_wordFilterReplied" }) || "Replied", value: iSaid });
        const logCh = client.channels.cache.get(consoleLogging) ?? await client.channels.fetch(consoleLogging).catch(() => null);
        if (logCh) logCh.send({ embeds: [embed] }).catch(() => {});
        insultedBack = true;
        break;
      }
    }

    if (!insultedBack) {
      for (const word of insultos) {
        if (lower.includes(word)) {
          let options = [
            await ougi.text({ msg, stringID: "badwords_es_resp1" }),
            await ougi.text({ msg, stringID: "badwords_es_resp2" }),
            await ougi.text({ msg, stringID: "badwords_es_resp3" }),
            "<:nou:726944701348970496>",
            "<:reverse:726944329754476614>"
          ];
          let iSaid = options[Math.floor(Math.random() * options.length)];
          if (replied_to_ougi && msg.reply) { msg.reply(iSaid).catch(console.error); }
          else if (msg.channel?.send) { msg.channel.send(iSaid).catch(console.error); }
          embed.addFields({ name: await ougi.text({ lang: 'en', stringID: "log_wordFilterReplied" }) || "Replied", value: iSaid });
          const logCh = client.channels.cache.get(consoleLogging) ?? await client.channels.fetch(consoleLogging).catch(() => null);
          if (logCh) logCh.send({ embeds: [embed] }).catch(() => {});
          insultedBack = true;
          break;
        }
      }
    }

    if (!insultedBack) {
      if (msg.content.includes("?")) {
        await ougi.answerCommand(msg, replied_to_ougi);
        return;
      }
      await ougi.mimicAbility(msg, replied_to_ougi);
    }
};
