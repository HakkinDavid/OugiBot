module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "reminder");
  embed.setDescription(await ougi.text({ msg, stringID: "reminderHelpDesc" }))
    .addFields({ name: await ougi.text({ msg, stringID: "example" }), value: "`ougi reminder 10m :: Turn off the oven`\n`ougi reminder 2h 30m :: Check the laundry`" })
    .addFields({ name: await ougi.text({ msg, stringID: "reminder_noteField" }), value: await ougi.text({ msg, stringID: "reminder_noteDesc", values: { separator: "`::`", s: "`s`", m: "`m`", h: "`h`", d: "`d`" } }) });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
