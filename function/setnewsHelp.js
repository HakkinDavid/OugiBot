module.exports =

async function (msg) {
  if (!(await ougi.guildCheck(msg))) return;
  let embed = await ougi.helpPreset(msg, "setnews");
  let outputTemplate = await ougi.text(msg, "setnews_output");
  embed.setDescription(await ougi.text(msg, "setnewsHelpDesc"))
  .addFields({name: await ougi.text(msg, "specialPermission"), value: ":warning: " + await ougi.text(msg, "onlyOwner")})
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi setnews `" + msg.channel.toString() + "` `"})
  .addFields({name: await ougi.text(msg, "output"), value: outputTemplate.replace(/{channel}/g, msg.channel.toString())})
  .addFields({name: await ougi.text(msg, "setnews_disableField"), value: "`ougi setnews disable`"})
  .addFields({name: await ougi.text(msg, "output"), value: await ougi.text(msg, "setnews_disableOutput")});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
