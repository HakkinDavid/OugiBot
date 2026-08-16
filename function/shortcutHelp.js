module.exports = async (msg) => {
  const embed = await ougi.helpPreset(msg, "shortcut");

  embed.setDescription(await ougi.text({ msg, stringID: "shortcutDesc" }));

  embed.addFields(
    {
      name: await ougi.text({ msg, stringID: "shortcutCreateTitle" }),
      value: (await ougi.text({ msg, stringID: "shortcutCreateField" })) + "\n" + "`ougi shortcut create <emoji> <command>`"
    },
    {
        name: await ougi.text({ msg, stringID: "example" }),
        value: "`ougi shortcut create 🐱 image a cute tabby orange cat`"
    },
    {
      name: await ougi.text({ msg, stringID: "shortcutDeleteTitle" }),
      value: (await ougi.text({ msg, stringID: "shortcutDeleteField" })) + "\n" + "`ougi shortcut delete <emoji>`"
    },
    {
        name: await ougi.text({ msg, stringID: "example" }),
        value: "`ougi shortcut delete 🐱`"
    }
  );

  msg.channel.send({ embeds: [embed] });
};
