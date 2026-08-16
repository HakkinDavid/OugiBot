module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "minesweeper");
  embed.setDescription(await ougi.text(msg, "minesweeperHelpDesc"))
    .addFields({
      name: await ougi.text(msg, "example"),
      value: "`ougi minesweeper`\n`ougi minesweeper ::title Spooky Field ::fill 💣 ::treasure 💎 ::difficulty 6`"
    })
    .addFields({
      name: await ougi.text(msg, "minesweeper_optionsField"),
      value: await ougi.text(msg, "minesweeper_optionsDesc")
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
