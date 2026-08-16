module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "calc");
  embed.setDescription(await ougi.text({ msg, stringID: "calcHelpDesc" }))
    .addFields({
      name: await ougi.text({ msg, stringID: "example" }),
      value: "`ougi calc 2 + 2 * (10 / 5)`"
    })
    .addFields({
      name: await ougi.text({ msg, stringID: "output" }),
      value: "Expression: `2 + 2 * (10 / 5)`\nResult: `6`"
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
