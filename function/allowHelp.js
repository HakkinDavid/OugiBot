module.exports =

async function (msg) {
  let embed = await ougi.helpPreset(msg, "allow");
  if (msg.channel.type != "text") {
    embed.addField(await ougi.text(msg, "onlyGuilds"), ":warning: " + await ougi.text(msg, "inGuildWarning"))
    msg.channel.send({embed}).catch(console.error);
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
  .addField(await ougi.text(msg, "specialPermission"), ":warning: " + await ougi.text(msg, "onlyOwner"))
  .addField(await ougi.text(msg, "example"), "`ougi allow " + allow + "`")
  .addField(await ougi.text(msg, "output"), answer);

  msg.channel.send({embed}).catch(console.error);
}
