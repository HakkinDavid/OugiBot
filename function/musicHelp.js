module.exports =

function (msg) {
  var videos = ["angels on my side", "every one of us", "never gonna give you up", "chocolate insomnia midi by hakkindavid", "07734 midi by hakkindavid"];
  var links = ["https://www.youtube.com/watch?v=Q2yderDJKJA", "https://www.youtube.com/watch?v=MsHk2Z41riE", "https://www.youtube.com/watch?v=7qZugJCf2eI", "https://www.youtube.com/watch?v=HPOKr-Wyscw", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"];
  var embed = new Discord.MessageEmbed()
  .setTitle("Ougi's `music` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setDescription("Use this command to make Ougi join your voice channel and play a YouTube video. Provide either a link or some keywords to search for in YouTube.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi music " + videos[Math.floor(Math.random()*videos.length)] + "`")
  .addField("Pro tip", "If you're too lazy to type `ougi music`, you may as well just type Ougi's prefix followed up by a YouTube link.\n`ougi " + links[Math.floor(Math.random()*links.length)] + "`")
  .addField("In order to create a music queue", "Execute the command as many times as needed, Ougi will automatically add the requested videos to your queue and will play them in order, one after another.")
  .addField("Skip a song", "`ougi music skip`")
  .addField("Remove a song from the queue by index", "`ougi music remove " + Math.floor(Math.random()*videos.length++) + "`")
  .addField("Preview the music queue", "`ougi music list` or `ougi music queue` or `ougi music playlist`")
  .addField("Stop the playback", "`ougi music stop`")
  .addField("Loop the queue", "`ougi music loop`")
  .addField("Break the queue loop", "`ougi music unloop`")
  .addField("Aliases", "This command can also be used as `ougi play` or `ougi p`.");

  msg.channel.send({embed}).catch(console.error);
}
