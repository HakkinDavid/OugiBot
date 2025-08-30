module.exports =

async function (arguments, msg) {
  if (!(await ougi.guildCheck(msg))) return;

  if (!(await ougi.adminCheck(msg))) return;

  if (arguments.length <= 0) {
    msg.channel.send("Ara ara, provide a phrase or a command that is at least one character long in order to blacklist it.");
    return
  }

  let trigger = arguments.join(" ");

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

  if (settingsOBJ.blacklist.hasOwnProperty(msg.guildId)){
    let existent = settingsOBJ.blacklist[msg.guildId];
    for(i = 0; i < existent.length; i++) {
      if(existent[i].toLowerCase() === trigger) {
        msg.channel.send("Sorry, that trigger is already blacklisted in " + msg.guild.toString() + ".").catch(console.error);
        return
      }
    }
    existent.push(trigger);
    msg.channel.send(answer).catch(console.error);
    client.channels.cache.get(consoleLogging).send("Trigger to be blacklisted: `" + trigger + "` in `" + msg.guild.toString() + "` with msg.guildId `" + msg.guildId + "`");
    settingsOBJ.blacklist[msg.guildId] = existent;
    await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);

    await ougi.backup("./settings.txt", channels.settings);
    return
  }

  msg.channel.send(answer).catch(console.error);
  client.channels.cache.get(consoleLogging).send("Trigger to be blacklisted: `" + trigger + "` in `" + msg.guild.toString() + "` with msg.guildId `" + msg.guildId + "`");

  settingsOBJ.blacklist[msg.guildId] = [];
  let arrayMaker = settingsOBJ.blacklist[msg.guildId];
  arrayMaker.push(trigger);
  settingsOBJ.blacklist[msg.guildId] = arrayMaker;
  await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);

  await ougi.backup("./settings.txt", channels.settings);
}
