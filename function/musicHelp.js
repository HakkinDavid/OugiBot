module.exports =

async function (msg) {
  var videos = ["angels on my side", "every one of us", "never gonna give you up", "chocolate insomnia midi by hakkindavid", "07734 midi by hakkindavid"];
  var links = ["https://www.youtube.com/watch?v=Q2yderDJKJA", "https://www.youtube.com/watch?v=MsHk2Z41riE", "https://www.youtube.com/watch?v=7qZugJCf2eI", "https://www.youtube.com/watch?v=HPOKr-Wyscw", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"];
  var embed = new Discord.EmbedBuilder()
  .setTitle("Ougi's `music` command")
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setDescription("Use this command to make Ougi join your voice channel and play a YouTube video. Provide either a link or some keywords to search for in YouTube.")
  .setFooter({text: "helpEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi music " + videos[Math.floor(Math.random()*videos.length)] + "`"})
  .addFields({name: "Pro tip", value: "If you're too lazy to type `ougi music`, you may as well just type Ougi's prefix followed up by a YouTube link.\n`ougi " + links[Math.floor(Math.random()*links.length)] + "`"})
  .addFields({name: "In order to create a music queue", value: "Execute the command as many times as needed, Ougi will automatically add the requested videos to your queue and will play them in order, one after another."})
  .addFields({name: "Skip a song", value: "`ougi music skip`"})
  .addFields({name: "Remove a song from the queue by index", value: "`ougi music remove " + Math.floor(Math.random()*videos.length++) + "`"})
  .addFields({name: "Preview the music queue", value: "`ougi music list` or `ougi music queue` or `ougi music playlist`"})
  .addFields({name: "Stop the playback", value: "`ougi music stop`"})
  .addFields({name: "Loop the queue", value: "`ougi music loop`"})
  .addFields({name: "Break the queue loop", value: "`ougi music unloop`"})
  .addFields({name: "Aliases", value: "This command can also be used as `ougi play` or `ougi p`."});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
