module.exports =

function (arguments, msg) {
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
    msg.channel.send("Ara ara, provide a phrase or a command that is at least one character long in order to whitelist it.");
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
    msg.channel.send("Ara ara, provide a phrase or a command that is at least one character long in order to whitelist it.");
    return
  }

  var pseudoArray = JSON.parse(fs.readFileSync('./blacklist.txt', 'utf-8', console.error));

  var afterOptions = [
    "I'll start reacting to `" + trigger + "` in " + msg.guild.toString() + ".",
    "Alright, I've whitelisted `" + trigger + "` in " + msg.guild.toString() + ".",
  ];
  var answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];
  var myBlacklist = "./blacklist.txt";

  if (pseudoArray.hasOwnProperty(guildID)){
    var existent = pseudoArray[guildID];
    for(var i = 0; i < existent.length; i++) {
      if(existent[i].toLowerCase() === trigger) {
        client.channels.get(consoleLogging).send("Trigger to be removed from blacklist: `" + trigger + "` in `" + msg.guild.toString() + "` with guildID `" + guildID + "`");
        existent.splice(i, 1);
        var proArray = JSON.stringify(pseudoArray);
        fs.writeFile('./blacklist.txt', proArray, console.error);
        msg.channel.send(answer).then().catch(console.error);
        ougi.backup(myBlacklist, blacklistChannel);
        return
      }
    }
  }
  msg.channel.send("Looks like this trigger wasn't blacklisted at all.");
  return
}
