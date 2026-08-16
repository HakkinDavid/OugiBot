module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "minesweeper");
  embed.setDescription(await ougi.text({ msg, stringID: "minesweeperHelpDesc" }))
    .addFields({
      name: await ougi.text({ msg, stringID: "example" }),
      value: "`ougi minesweeper`\n`ougi minesweeper ::title Spooky Field ::fill 💣 ::treasure 💎 ::difficulty 6`"
    })
    .addFields({
      name: await ougi.text({ msg, stringID: "minesweeper_optionsField" }),
      value: await ougi.text({
        msg,
        stringID: "minesweeper_optionsDesc",
        values: {
          titleOption: "`::title <text>`",
          fillOption: "`::fill <emoji/text>`",
          treasureOption: "`::treasure <emoji/text>`",
          difficultyOption: "`::difficulty <1-10>`"
        }
      })
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
