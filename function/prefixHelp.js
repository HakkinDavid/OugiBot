module.exports =

async function (msg) {
  let possiblePrefix = ["spooky", "oshino", "xXOugi_YTXx", "o!", "$p00ky"];
  if (!(await ougi.guildCheck(msg))) return;
  let embed = await ougi.helpPreset(msg, "prefix");
  embed.setDescription(await ougi.text(msg, "prefixHelpDesc"))
  .addFields({name: await ougi.text(msg, "specialPermission"), value: ":warning: " + await ougi.text(msg, "onlyOwner")})
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi prefix " + possiblePrefix[Math.floor(Math.random()*possiblePrefix.length)] + "`"});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
