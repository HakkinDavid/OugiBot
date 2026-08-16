module.exports =

async function (msg) {
  var embed = await ougi.helpPreset(msg, "skip");
  embed.setDescription(await ougi.text(msg, "skipHelpDesc"))
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi skip`"})
  .addFields({name: await ougi.text(msg, "output"), value: await ougi.text(msg, "musicSkipped")});
  msg.channel.send({embeds: [embed]}).catch(console.error);
}
