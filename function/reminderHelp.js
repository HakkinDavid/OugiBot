module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "reminder");
  embed.setDescription("Set a personal timer for Ougi to remind you about something after a specified duration.")
    .addFields({ name: await ougi.text(msg, "example"), value: "`ougi reminder 10m :: Turn off the oven`\n`ougi reminder 2h 30m :: Check the laundry`" })
    .addFields({ name: "Note", value: "You must separate the duration and reminder message using double colons (`::`). Supported time units are `s` (seconds), `m` (minutes), `h` (hours), and `d` (days)." });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
