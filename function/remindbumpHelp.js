module.exports =

async function (msg) {
  if (!(await ougi.guildCheck(msg))) return;
  let embed = await ougi.helpPreset(msg, "remindbump");
  let outputTemplate = await ougi.text(msg, "remindbump_output");
  embed.setDescription(await ougi.text(msg, "remindbumpHelpDesc"))
  .addFields({ name: await ougi.text(msg, "specialPermission"), value: ":warning: " + await ougi.text(msg, "onlyOwner") })
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi remindbump `" + msg.channel.toString() + "` @role `"})
  .addFields({name: await ougi.text(msg, "output"), value: outputTemplate.replace(/{channel}/g, msg.channel.toString())})
  .addFields({name: await ougi.text(msg, "remindbump_disableField"), value: "`ougi remindbump disable`"})
  .addFields({name: await ougi.text(msg, "output"), value: await ougi.text(msg, "remindbump_disableOutput")});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
