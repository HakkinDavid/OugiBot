module.exports =

async function (msg) {
  let embed = await ougi.helpPreset(msg, "allow");
  if (msg.channel.type != "text") {
    embed.addFields({name: await ougi.text(msg, "onlyGuilds"), value: ":warning: " + await ougi.text(msg, "inGuildWarning")})
    msg.channel.send({embeds: [embed]}).catch(console.error);
    return
  }
  let phrases = ["sike", "say a bad word", "snipe"];
  let allow = phrases[Math.floor(Math.random()*phrases.length)];
  let afterOptions = [
    await ougi.text(msg, "reactingTo"),
    await ougi.text(msg, "alrightWhitelisted"),
  ];
  let answer = afterOptions[Math.floor(Math.random()*afterOptions.length)].replace(/{triggerName}/, "`" + allow + "`").replace(/{guildName}/, msg.guild.toString());
  embed.setDescription(await ougi.text(msg, "allowUsage"))
  .addFields({name: await ougi.text(msg, "specialPermission"), value: ":warning: " + await ougi.text(msg, "onlyOwner")})
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi allow " + allow + "`"})
  .addFields({name: await ougi.text(msg, "output"), value: answer});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
