module.exports =

async function (msg) {
  if (msg.channel.type != "text") {
    let embed = new Discord.MessageEmbed()
    .setTitle("Ougi's `blacklist` command")
    .setAuthor("Ougi [BOT]", client.user.avatarURL())
    .setColor("#230347")
    .setFooter("helpEmbed by Ougi", client.user.avatarURL())
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
    .addField("This is only available in Discord servers.", ":warning: You must be in a Discord server in order to preview information about this command.")
    msg.channel.send({embed}).catch(console.error);
    return
  }
  let phrases = ["sike", "say a bad word", "snipe"];
  let remove = phrases[Math.floor(Math.random()*phrases.length)];
  let afterOptions = [
    "I'll stop reacting to `" + remove + "` in " + msg.guild.toString() + ".",
    "Alright, I've blacklisted `" + remove + "` in " + msg.guild.toString() + ".",
  ];
  let answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];
  let embed = new Discord.MessageEmbed()
  .setTitle("Ougi's `blacklist` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setDescription("Use this command to blacklist a trigger in this Discord server, Ougi will start ignoring that input.")
  .addField("Special permission required", ":warning: You must be the owner of whatever Discord server you run this command in.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField(await ougi.text(msg, "example"), "`ougi blacklist " + remove + "`")
  .addField(await ougi.text(msg, "output"), answer)
  .addField("After that, if anyone executes the following", "`ougi " + remove + "`")
  .addField(await ougi.text(msg, "output"), "Sorry, that's blacklisted in " + msg.guild.toString() + ".")

  msg.channel.send({embed}).catch(console.error);
}
