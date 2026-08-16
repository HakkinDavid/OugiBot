const { EmbedBuilder } = require('discord.js');

const activeTimers = [];

module.exports = async function remindMe(msg) {
  const content = msg.content.trim().slice(msg.content.indexOf("reminder") + "reminder".length).trim();
  
  if (!content || !content.includes("::")) {
    msg.channel.send(await ougi.text({ msg, stringID: "remind_specifyDuration", values: { separator: "`::`", example: "`ougi reminder 10m :: Turn off the oven`" } })).catch(console.error);
    return;
  }

  const parts = content.split("::").map(s => s.trim());
  const timeStr = parts[0].toLowerCase();
  const reminderMessage = parts.slice(1).join("::").trim();

  let durationMs = 0;
  const matchHours = timeStr.match(/(\d+)\s*h/);
  const matchMins = timeStr.match(/(\d+)\s*m/);
  const matchSecs = timeStr.match(/(\d+)\s*s/);
  const matchDays = timeStr.match(/(\d+)\s*d/);

  if (matchDays) durationMs += parseInt(matchDays[1], 10) * 24 * 60 * 60 * 1000;
  if (matchHours) durationMs += parseInt(matchHours[1], 10) * 60 * 60 * 1000;
  if (matchMins) durationMs += parseInt(matchMins[1], 10) * 60 * 1000;
  if (matchSecs) durationMs += parseInt(matchSecs[1], 10) * 1000;

  if (durationMs <= 0) {
    // Attempt raw number as minutes
    const rawNum = parseInt(timeStr, 10);
    if (!isNaN(rawNum) && rawNum > 0) {
      durationMs = rawNum * 60 * 1000;
    } else {
      msg.channel.send(await ougi.text({ msg, stringID: "remind_invalidFormat", values: { example1: "`10m`", example2: "`2h`", example3: "`1d`", example4: "`30s`" } })).catch(console.error);
      return;
    }
  }

  const triggerAt = Date.now() + durationMs;
  const humanDuration = ougi.toHumanTime(Date.now() - durationMs);

  const embed = new EmbedBuilder()
    .setTitle(await ougi.text({ msg, stringID: "remind_setTitle" }))
    .setDescription(
      await ougi.text({
        msg,
        stringID: "remind_setDesc",
        values: {
          reminder: reminderMessage,
          timestamp: Math.floor(triggerAt / 1000)
        }
      })
    )
    .setColor("#FFA500")
    .setFooter({ text: await ougi.text({ msg, stringID: "remind_footer" }), iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) })
    .setTimestamp();

  await msg.channel.send({ embeds: [embed] });

  setTimeout(async () => {
    const remindEmbed = new EmbedBuilder()
      .setTitle(await ougi.text({ msg, stringID: "remind_alertTitle" }))
      .setDescription(
        await ougi.text({
          msg,
          stringID: "remind_alertDesc",
          values: {
            user: `<@${msg.author.id}>`,
            reminder: reminderMessage
          }
        })
      )
      .setColor("#FF0055")
      .setTimestamp();

    await msg.channel.send({ content: `<@${msg.author.id}>`, embeds: [remindEmbed] }).catch(console.error);
  }, durationMs);
};
