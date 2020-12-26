module.exports =

async function (arguments, msg) {
  if (msg.channel.type != "text") {
    msg.channel.send("You must be in a server to run this command.");
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
    msg.channel.send("Avoid mentions or custom emoji please. What? Isn't that a mention or a custom emoji? Well, then don't include '\<\@' and '>' in the same message.").then().catch(console.error);
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

  let pseudoArray = JSON.parse(fs.readFileSync('./settings.txt', 'utf-8', console.error));

  let afterOptions = [
    "I'll stop reacting to `" + trigger + "` in " + msg.guild.toString() + ".",
    "Alright, I've blacklisted `" + trigger + "` in " + msg.guild.toString() + ".",
  ];
  let answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];
  let myBlacklist = "./settings.txt";

  if (pseudoArray.blacklist.hasOwnProperty(guildID)){
    let existent = pseudoArray.blacklist[guildID];
    for(i = 0; i < existent.length; i++) {
      if(existent[i].toLowerCase() === trigger) {
        msg.channel.send("Sorry, that trigger is already blacklisted in " + msg.guild.toString() + ".").then().catch(console.error);
        return
      }
    }
    existent.push(trigger);
    msg.channel.send(answer).then().catch(console.error);
    client.channels.cache.get(consoleLogging).send("Trigger to be blacklisted: `" + trigger + "` in `" + msg.guild.toString() + "` with guildID `" + guildID + "`");
    pseudoArray.blacklist[guildID] = existent;
    let proArray = JSON.stringify(pseudoArray);
    fs.writeFile('./settings.txt', proArray, console.error);

    ougi.backup(myBlacklist, settingsChannel);
    return
  }

  msg.channel.send(answer).then().catch(console.error);
  client.channels.cache.get(consoleLogging).send("Trigger to be blacklisted: `" + trigger + "` in `" + msg.guild.toString() + "` with guildID `" + guildID + "`");

  pseudoArray.blacklist[guildID] = [];
  let arrayMaker = pseudoArray.blacklist[guildID];
  arrayMaker.push(trigger);
  pseudoArray.blacklist[guildID] = arrayMaker;
  let proArray = JSON.stringify(pseudoArray);
  fs.writeFile('./settings.txt', proArray, console.error);

  ougi.backup(myBlacklist, settingsChannel);
}
