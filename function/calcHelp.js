module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "calc");
  embed.setDescription(await ougi.text(msg, "calcHelpDesc"))
    .addFields({
      name: await ougi.text(msg, "example"),
      value: "`ougi calc 2 + 2 * (10 / 5)`"
    })
    .addFields({
      name: await ougi.text(msg, "output"),
      value: "Expression: `2 + 2 * (10 / 5)`\nResult: `6`"
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
