module.exports =

async function (msg) {
  var embed = await ougi.helpPreset(msg, "unsubscribe");
  embed.setDescription(await ougi.text(msg, "unsubscribeHelpDesc"))
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi unsubscribe`"})
  .addFields({name: await ougi.text(msg, "output"), value: await ougi.text(msg, "unsubscribe_helpOutput")});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
