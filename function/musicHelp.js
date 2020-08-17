module.exports =

function (msg) {
  var videos = ["angels on my side", "every one of us", "never gonna give you up", "https://www.youtube.com/watch?v=Q2yderDJKJA", "https://www.youtube.com/watch?v=MsHk2Z41riE", "https://www.youtube.com/watch?v=7qZugJCf2eI", "https://www.youtube.com/watch?v=HPOKr-Wyscw"];
  var embed = new Discord.MessageEmbed()
  .setTitle("Ougi's `music` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setDescription("Use this command to make Ougi join your voice channel and play a YouTube video. Provide either a link or some keywords to search for in YouTube.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi music " + videos[Math.floor(Math.random()*videos.length)] + "`");

  msg.channel.send({embed}).catch(console.error);
}
