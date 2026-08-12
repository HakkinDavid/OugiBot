module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "minesweeper");
  embed.setDescription("Generate an interactive Discord spoiler minesweeper grid.")
    .addFields({
      name: await ougi.text(msg, "example"),
      value: "`ougi minesweeper`\n`ougi minesweeper ::title Spooky Field ::fill 💣 ::treasure 💎 ::difficulty 6`"
    })
    .addFields({
      name: "Available Options",
      value: "• `::title <text>` - Set custom title\n• `::fill <emoji/text>` - Custom mine emoji\n• `::treasure <emoji/text>` - Custom treasure emoji\n• `::difficulty <1-10>` - Set mine grid density"
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
