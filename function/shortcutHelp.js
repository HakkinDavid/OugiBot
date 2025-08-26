module.exports = async (msg) => {
  const embed = await ougi.helpPreset(msg, "shortcut");

  embed.setDescription(await ougi.text(msg, "shortcutDesc"));

  embed.addFields(
    {
      name: await ougi.text(msg, "shortcutCreateTitle"),
      value: (await ougi.text(msg, "shortcutCreateField")) + "\n" + "`ougi shortcut create <emoji> <command>`"
    },
    {
        name: await ougi.text(msg, "example"),
        value: "`ougi shortcut create 🐱 image a cute tabby orange cat`"
    },
    {
      name: await ougi.text(msg, "shortcutDeleteTitle"),
      value: (await ougi.text(msg, "shortcutDeleteField")) + "\n" + "`ougi shortcut delete <emoji>`"
    },
    {
        name: await ougi.text(msg, "example"),
        value: "`ougi shortcut delete 🐱`"
    }
  );

  msg.channel.send({ embeds: [embed] });
};
