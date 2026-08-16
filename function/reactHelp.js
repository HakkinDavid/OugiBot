module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "react");
  embed.setDescription(await ougi.text(msg, "reactHelpDesc"))
    .addFields({ name: await ougi.text(msg, "example"), value: "`ougi react 🍰`" });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
