module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "react");
  embed.setDescription("Use this command while replying to a message to make Ougi react to that message with a specified emoji.")
    .addFields({ name: await ougi.text(msg, "example"), value: "`ougi react 🍰`" });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
