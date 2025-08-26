module.exports = async (msg) => {
  const embed = await ougi.helpPreset(msg, "shortcut");

  embed.setDescription(await ougi.text(msg, "shortcutDesc"));

  embed.addFields(
    {
      name: await ougi.text(msg, "shortcutCreateTitle"),
      value: await ougi.text(msg, "shortcutCreateField")
    },
    {
      name: await ougi.text(msg, "shortcutDeleteTitle"),
      value: await ougi.text(msg, "shortcutDeleteField")
    }
  );

  msg.channel.send({ embeds: [embed] });
};
