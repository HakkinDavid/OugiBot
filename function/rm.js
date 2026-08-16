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

  if (trigger.startsWith("help") || trigger.startsWith("blacklist") || trigger.startsWith("setlog") || trigger.startsWith("allow") || ougi.helperFunctions.checkForPrefixStr(trigger, msg.guildId)) {
    msg.channel.send(await ougi.text(msg, "rm_cantBlacklist"));
    return;
  }

  const stopReactingTemplate = await ougi.text(msg, "rm_stopReacting");
  const blacklistedTemplate = await ougi.text(msg, "rm_blacklisted");

  let afterOptions = [
    stopReactingTemplate.replace(/{trigger}/g, trigger).replace(/{guild}/g, msg.guild.toString()),
    blacklistedTemplate.replace(/{trigger}/g, trigger).replace(/{guild}/g, msg.guild.toString()),
  ];
  let answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];

  const isAlreadyBlacklisted = ougi.db().getBlacklist(msg.guildId).some(t => t.toLowerCase() === trigger.toLowerCase());
  if (isAlreadyBlacklisted) {
    const alreadyBlTemplate = await ougi.text(msg, "rm_alreadyBlacklisted");
    msg.channel.send(alreadyBlTemplate.replace(/{trigger}/g, trigger).replace(/{guild}/g, msg.guild.toString())).catch(console.error);
    return;
  }

  msg.channel.send(answer).catch(console.error);
  client.channels.cache.get(consoleLogging).send("Trigger to be blacklisted: `" + trigger + "` in `" + msg.guild.toString() + "` with msg.guildId `" + msg.guildId + "`");
  ougi.db().blacklistTrigger(msg.guildId, trigger);
}
