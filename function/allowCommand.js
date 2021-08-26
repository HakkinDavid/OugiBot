module.exports =

async function (arguments, msg) {
  if (msg.channel.type != "text") {
    msg.channel.send(await ougi.text(msg, "mustGuild"));
    return
  }

  let guildID = msg.guild.id;
  let elAdmin = msg.guild.ownerID;

  if (elAdmin != msg.author.id) {
    msg.channel.send(await ougi.text(msg, "mustOwn"));
    return
  }

  if (arguments.length <= 0) {
    msg.channel.send(await ougi.text(msg, "oneCharWhitelist"));
    return
  }

  let trigger = arguments.join(" ");

  if (msg.content.includes("@everyone") || msg.content.includes("@here")) {
    msg.channel.send(await ougi.text(msg, "massivePing"));
    return
  }

  if (trigger.includes("<@") && trigger.includes(">")) {
    msg.channel.send(await ougi.text(msg, "avoidSpecialChar")).catch(console.error);
    return
  }

  while (trigger.endsWith(" ")){
    trigger = trigger.substring(0, trigger.length-1)
  }

  while (trigger.startsWith(" ")){
    trigger = trigger.substring(1, trigger.length)
  }

  if (trigger.length <= 0) {
    msg.channel.send(await ougi.text(msg, "oneCharWhitelist"));
    return
  }

  let afterOptions = [
    await ougi.text(msg, "reactingTo"),
    await ougi.text(msg, "alrightWhitelisted"),
  ];
  let answer = afterOptions[Math.floor(Math.random()*afterOptions.length)].replace(/{triggerName}/, "`" + trigger + "`").replace(/{guildName}/, msg.guild.toString());

  if (settingsOBJ.blacklist.hasOwnProperty(guildID)){
    let existent = settingsOBJ.blacklist[guildID];
    for(let i = 0; i < existent.length; i++) {
      if(existent[i].toLowerCase() === trigger) {
        client.channels.cache.get(consoleLogging).send("Trigger to be removed from blacklist: `" + trigger + "` in `" + msg.guild.toString() + "` with guildID `" + guildID + "`");
        existent.splice(i, 1);
        fs.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);
        msg.channel.send(answer).catch(console.error);
        ougi.backup("./settings.txt", settingsChannel);
        return
      }
    }
  }
  msg.channel.send(await ougi.text(msg, "notBlacklisted"));
  return
}
