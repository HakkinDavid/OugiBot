module.exports =

async function (arguments, msg) {
  if (msg.channel.type != "text") {
    msg.channel.send(await ougi.text(msg, "mustGuild"));
    return
  }

  var guildID = msg.guild.id;
  var elAdmin = msg.guild.ownerID;

  if (elAdmin != msg.author.id) {
    msg.channel.send("You must be the server's owner to run this command.");
    return
  }

  if (arguments.length <= 0) {
    msg.channel.send("Ara ara, provide a phrase or a command that is at least one character long in order to blacklist it.");
    return
  }

  var trigger = arguments.join(" ");

  if (msg.content.includes("@everyone") || msg.content.includes("@here")) {
    msg.channel.send("Ora ora ora ora! Remove that massive ping.");
    return
  }

  if (trigger.includes("<@") && trigger.includes(">")) {
    msg.channel.send("Avoid mentions or custom emoji please. What? Isn't that a mention or a custom emoji? Well, then don't include '\<\@' and '>' in the same message.").catch(console.error);
    return
  }

  while (trigger.endsWith(" ")){
    trigger = trigger.substring(0, trigger.length-1)
  }

  while (trigger.startsWith(" ")){
    trigger = trigger.substring(1, trigger.length)
  }

  if (trigger.length <= 0) {
    msg.channel.send("Ara ara, provide a phrase or a command that is at least one character long in order to blacklist it.");
    return
  }

  if (trigger.startsWith("help") || trigger.startsWith("remove") || trigger.startsWith("setlog") || trigger.startsWith("allow") || trigger.startsWith("ougi")) {
    msg.channel.send("This command can't be blacklisted.");
    return
  }

  let afterOptions = [
    "I'll stop reacting to `" + trigger + "` in " + msg.guild.toString() + ".",
    "Alright, I've blacklisted `" + trigger + "` in " + msg.guild.toString() + ".",
  ];
  let answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];

  if (settingsOBJ.blacklist.hasOwnProperty(guildID)){
    let existent = settingsOBJ.blacklist[guildID];
    for(i = 0; i < existent.length; i++) {
      if(existent[i].toLowerCase() === trigger) {
        msg.channel.send("Sorry, that trigger is already blacklisted in " + msg.guild.toString() + ".").catch(console.error);
        return
      }
    }
    existent.push(trigger);
    msg.channel.send(answer).catch(console.error);
    client.channels.cache.get(consoleLogging).send("Trigger to be blacklisted: `" + trigger + "` in `" + msg.guild.toString() + "` with guildID `" + guildID + "`");
    settingsOBJ.blacklist[guildID] = existent;
    await ougi.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);

    await ougi.backup("./settings.txt", settingsChannel);
    return
  }

  msg.channel.send(answer).catch(console.error);
  client.channels.cache.get(consoleLogging).send("Trigger to be blacklisted: `" + trigger + "` in `" + msg.guild.toString() + "` with guildID `" + guildID + "`");

  settingsOBJ.blacklist[guildID] = [];
  let arrayMaker = settingsOBJ.blacklist[guildID];
  arrayMaker.push(trigger);
  settingsOBJ.blacklist[guildID] = arrayMaker;
  await ougi.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);

  await ougi.backup("./settings.txt", settingsChannel);
}
