module.exports =

function allowHelp(msg) {
  if (msg.channel.type != "text") {
    var embed = new Discord.RichEmbed()
    .setTitle("Ougi's `allow` command")
    .setAuthor("Ougi [BOT]", client.user.avatarURL)
    .setColor("#230347")
    .setFooter("helpEmbed by Ougi", client.user.avatarURL)
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
    .addField("This is only available in Discord servers.", ":warning: You must be in a Discord server in order to preview information about this command.")
    msg.channel.send({embed}).catch(console.error);
    return
  }
  var phrases = ["sike", "say a bad word", "snipe"];
  var allow = phrases[Math.floor(Math.random()*phrases.length)];
  var afterOptions = [
    "I'll start reacting to `" + allow + "` in " + msg.guild.toString() + ".",
    "Alright, I've whitelisted `" + allow + "` in " + msg.guild.toString() + ".",
  ];
  var answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];
  var embed = new Discord.RichEmbed()
  .setTitle("Ougi's `allow` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL)
  .setColor("#230347")
  .setDescription("Use this command to whitelist a trigger that was blacklisted in this Discord server, Ougi will start processing that input.")
  .addField("Special permission required", ":warning: You must be the owner of whatever Discord server you run this command in.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi allow " + allow + "`")
  .addField("Output", answer)

  msg.channel.send({embed}).catch(console.error);
}
