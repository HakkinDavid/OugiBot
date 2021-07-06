module.exports =

async function (msg) {
  let possiblePrefix = ["spooky", "oshino", "xXOugi_YTXx", "o!", "$p00ky"];
  let embed = new Discord.MessageEmbed()
  .setTitle("Ougi's `prefix` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
  .setColor("#230347")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true");
  if (msg.channel.type != "text") {
    embed.addField("This is only available in Discord servers.", ":warning: You must be in a Discord server in order to preview information about this command.")
    msg.channel.send(embed).catch(console.error);
    return
  }
  embed.setDescription("Use this command to change Ougi's prefix inside your Discord server to anything you'd like.")
  .addField("Special permission required", ":warning: You must be the owner of whatever Discord server you run this command in.")
  .addField(await ougi.text(msg, "example"), "`ougi prefix " + possiblePrefix[Math.floor(Math.random()*possiblePrefix.length)] + "`");

  msg.channel.send(embed).catch(console.error);
}
