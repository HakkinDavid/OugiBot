module.exports =

async function (msg) {
  if (!(await ougi.guildCheck(msg))) return;
  let embed = await ougi.helpPreset(msg, "setlog");
  let outputTemplate = await ougi.text(msg, "setlog_output");
  embed.setDescription(await ougi.text(msg, "setlogHelpDesc"))
  .addFields({name: await ougi.text(msg, "specialPermission"), value: ":warning: " + await ougi.text(msg, "onlyOwner")})
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi setlog `" + msg.channel.toString() + "` `"})
  .addFields({name: await ougi.text(msg, "output"), value: outputTemplate.replace(/{channel}/g, msg.channel.toString())})
  .addFields({name: await ougi.text(msg, "setlog_disableField"), value: "`ougi setlog disable`"})
  .addFields({name: await ougi.text(msg, "output"), value: await ougi.text(msg, "setlog_disableOutput")});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
