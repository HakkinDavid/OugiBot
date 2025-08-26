module.exports = async (msg) => {
  const embed = await ougi.helpPreset(msg, "shortcut");

  embed.setDescription(await ougi.text(msg, "shortcutDesc"));

  embed.addFields(
    {
      name: await ougi.text(msg, "shortcutCreateTitle"),
      value: (await ougi.text(msg, "shortcutCreateField")).replace(/\{c\}/, 'ougi shortcut create <emoji> <action>').replace(/\{e\}/, ':sunglasses:')
    },
    {
      name: await ougi.text(msg, "shortcutDeleteTitle"),
      value: (await ougi.text(msg, "shortcutDeleteField")).replace(/\{c\}/, 'ougi shortcut delete <emoji>')
    }
  );

  msg.channel.send({ embeds: [embed] });
};
