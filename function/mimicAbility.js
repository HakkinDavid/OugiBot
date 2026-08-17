module.exports = async function (msg, replied_to_ougi) {
  let rawWords = msg.content.toLowerCase().split(" ").slice(0, 5);
  let reply = await ougi.customEmoji(rawWords, null, true);
  if (Array.isArray(reply) && reply.length > 0) {
    while (reply.length > 3) {
      reply.splice(Math.floor(Math.random() * reply.length), 1);
    }
    reply = reply.join(" ");
  } else {
    reply = "👻";
  }

  const avatar = client.user.displayAvatarURL({ dynamic: true, size: 4096 });
  let embed = new Discord.EmbedBuilder()
    .setTitle(await ougi.text({ lang: 'en', stringID: "log_mimicTitle" }) || "Mimic Response")
    .setColor("#FF008C")
    .setFooter({ text: await ougi.text({ lang: 'en', stringID: "log_globalEmbedFooter" }) || "Global Log", iconURL: avatar })
    .addFields({ name: await ougi.text({ lang: 'en', stringID: "log_mimicReplied" }) || "Replied", value: reply });

  if (replied_to_ougi && msg.reply) { msg.reply(reply).catch(console.error); }
  else if (msg.channel?.send) { msg.channel.send(reply).catch(console.error); }
  
  const logCh = client.channels.cache.get(consoleLogging) ?? await client.channels.fetch(consoleLogging).catch(() => null);
  if (logCh) logCh.send({ embeds: [embed] }).catch(() => {});
};
