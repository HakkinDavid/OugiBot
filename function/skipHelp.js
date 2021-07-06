module.exports =

async function (msg) {
  var embed = new Discord.MessageEmbed()
  .setTitle("Ougi's `skip` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
  .setColor("#230347")
  .setDescription("Use this command to skip the current song from your music queue.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField(await ougi.text(msg, "example"), "`ougi skip`")
  .addField(await ougi.text(msg, "output"), "Skipped!");
  msg.channel.send({embed}).catch(console.error);
}
