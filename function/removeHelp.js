module.exports =

async function (msg) {
  if (msg.channel.type != "text") {
    let embed = new Discord.EmbedBuilder()
    .setTitle("Ougi's `blacklist` command")
    .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
    .setColor("#230347")
    .setFooter({text: "helpEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
    .addFields({name: "This is only available in Discord servers.", value: ":warning: You must be in a Discord server in order to preview information about this command."})
    msg.channel.send({embeds: [embed]}).catch(console.error);
    return
  }
  let phrases = ["sike", "say a bad word", "snipe"];
  let remove = phrases[Math.floor(Math.random()*phrases.length)];
  let afterOptions = [
    "I'll stop reacting to `" + remove + "` in " + msg.guild.toString() + ".",
    "Alright, I've blacklisted `" + remove + "` in " + msg.guild.toString() + ".",
  ];
  let answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];
  let embed = new Discord.EmbedBuilder()
  .setTitle("Ougi's `blacklist` command")
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setDescription("Use this command to blacklist a trigger in this Discord server, Ougi will start ignoring that input.")
  .addFields({name: "Special permission required", value: ":warning: You must be the owner of whatever Discord server you run this command in."})
  .setFooter({text: "helpEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi blacklist " + remove + "`"})
  .addFields({name: await ougi.text(msg, "output"), value: answer})
  .addFields({name: "After that, if anyone executes the following", value: "`ougi " + remove + "`"})
  .addFields({name: await ougi.text(msg, "output"), value: "Sorry, that's blacklisted in " + msg.guild.toString() + "."})

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
