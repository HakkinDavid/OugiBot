module.exports = async function (msg) {
  let embed = await ougi.helpPreset(msg, "results");
  embed.setDescription(await ougi.text(msg, "resultsHelpDesc"))
    .addFields({
      name: await ougi.text(msg, "example"),
      value: "`ougi results 1691234567890`"
    });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
