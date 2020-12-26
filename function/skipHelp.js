module.exports =

async function (msg) {
  var embed = new Discord.MessageEmbed()
  .setTitle("Ougi's `skip` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setDescription("Use this command to skip the current song from your music queue.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi skip`")
  .addField("Output", "Skipped!");
  msg.channel.send({embed}).catch(console.error);
}
