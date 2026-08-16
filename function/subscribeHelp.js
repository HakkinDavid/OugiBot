module.exports =

async function (msg) {
  var embed = await ougi.helpPreset(msg, "subscribe");
  var outTemplate = await ougi.text(msg, "subscribe_helpOutput");
  embed.setDescription(await ougi.text(msg, "subscribeHelpDesc"))
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi subscribe`"})
  .addFields({name: await ougi.text(msg, "output"), value: outTemplate.replace(/{user}/g, msg.author.username)});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
