const { EmbedBuilder } = require('discord.js');

const activeTimers = [];

module.exports = async function remindMe(msg) {
  const content = msg.content.trim().slice(msg.content.indexOf("reminder") + "reminder".length).trim();
  
  if (!content || !content.includes("::")) {
    msg.channel.send("Please specify a duration and a reminder message using `::`.\nExample: `ougi reminder 10m :: Turn off the oven`").catch(console.error);
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
      msg.channel.send("Invalid duration format. Please specify time as `10m`, `2h`, `1d`, or `30s`.").catch(console.error);
      return;
    }
  }

  const triggerAt = Date.now() + durationMs;
  const humanDuration = ougi.toHumanTime(Date.now() - durationMs);

  const embed = new EmbedBuilder()
    .setTitle("⏰ Reminder Set!")
    .setDescription(`I'll remind you about: **"${reminderMessage}"**\nTarget time: <t:${Math.floor(triggerAt / 1000)}:R>`)
    .setColor("#FFA500")
    .setFooter({ text: "Ougi Reminder Engine", iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) })
    .setTimestamp();

  await msg.channel.send({ embeds: [embed] });

  setTimeout(async () => {
    const remindEmbed = new EmbedBuilder()
      .setTitle("⏰ Reminder Alert!")
      .setDescription(`<@${msg.author.id}>, you asked me to remind you:\n\n> **${reminderMessage}**`)
      .setColor("#FF0055")
      .setTimestamp();

    await msg.channel.send({ content: `<@${msg.author.id}>`, embeds: [remindEmbed] }).catch(console.error);
  }, durationMs);
};
