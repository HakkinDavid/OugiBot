module.exports =

async function (msg) {
  /*-----------------------------------*/
  while (msg.content.includes('  ')) {
    msg.content = msg.content.replace('  ', ' ')
  }
  while (msg.content.includes('\n\n')) {
    msg.content = msg.content.replace('\n\n', '\n')
  }
  while (msg.content.includes('\n')) {
    msg.content = msg.content.replace('\n', ' ')
  }
  var spookyCake = msg.content;
  var spookySlices = spookyCake.split(" ");
  var spookyCommand = spookySlices[1];
  var arguments = spookySlices.slice(2);
  /*-----------------------------------*/

  if (!msg.guild) {
    msg.channel.send("Huh?! This is not a Discord server. Take me into one!").then().catch(console.error);
    return
  }

  if (arguments.length < 1) {
    msg.channel.send("Please specify a YouTube link or some keywords to search for in YouTube.")
    return
  }

  var vcChannel = msg.member.voice.channel;

  if (vcChannel == null) {
    msg.channel.send("Looks like you're not in a voice channel I can join, please get into one.").then().catch(console.error);
    return
  }

  if (arguments == "leave") {
    await vcChannel.leave();
    var response = [":pensive:", "oke, bye", "aight imma head out"];
    msg.channel.send(response[Math.floor(Math.random()*response.length)]).then().catch(console.error);
    return
  }

  if (vcChannel.full) {
    msg.channel.send("That voice channel is full, so I can't join.").then().catch(console.error);
    return
  }

  if (vcChannel.joinable) {
    await vcChannel.join().then(connection => {
      if (arguments[0].toLowerCase().replace("https://", "").replace("www.", "").replace("youtu.be/", "youtube.com/watch?v=").startsWith("youtube.com/watch?v=")) {
        var myVideoIDLENGTH = arguments[0].length - arguments[0].toLowerCase().replace("https://", "").replace("www.", "").replace("youtu.be/", "").replace("youtube.com/watch?v=", "").length;
        var myVideoID = arguments[0].slice(myVideoIDLENGTH);
        scrapeYt.getVideo(myVideoID).then(video => {
          if (video.length < 1) {
            msg.channel.send("That video is either unavailable or unexistent.");
            return
          }
          var anURL = "https://www.youtube.com/watch?v=" + video.id;
          var videoImage = video.thumbnail;
          var videoAuthor = video.channel.name;
          var videoTitle = video.title;
          var durationInMilliseconds = video.duration * 1000;
          var durationInMinutes = [Math.floor(video.duration / 60), video.duration - Math.floor(video.duration / 60)*60];
          for (i=0; durationInMinutes.length > i; i++) {
            if (durationInMinutes[i].toString().length < 2) {
              durationInMinutes[i] = "0" + durationInMinutes[i].toString()
            }
          }
          connection.play(ytdl(anURL));
          connection.on("error", (error) => {
            connection.disconnect();
            vcChannel.join().then(connection => {
              connection.play(ytdl(anURL));
            })
          })
          let musicalEmbed = new Discord.MessageEmbed()
          .setTitle("Music with Ougi")
          .setAuthor("Ougi [BOT]", client.user.avatarURL())
          .setColor("#230347")
          .setDescription("Now playing")
          .setFooter("musicalEmbed by Ougi", client.user.avatarURL())
          .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
          .setImage(videoImage)
          .setTimestamp()
          .addField(videoTitle, "by " + videoAuthor + "\nDuration: " + durationInMinutes.join(":"));
          msg.channel.send(musicalEmbed).then().catch(console.error);
        });
      }
      else {
        scrapeYt.search(arguments.join(" "), {
          type: "video",
          limit: 1
        }).then(videos => {
          var anURL = "https://www.youtube.com/watch?v=" + videos[0].id;
          var videoImage = videos[0].thumbnail;
          var videoAuthor = videos[0].channel.name;
          var videoTitle = videos[0].title;
          var durationInMilliseconds = videos[0].duration * 1000;
          var durationInMinutes = [Math.floor(videos[0].duration / 60), videos[0].duration - Math.floor(videos[0].duration / 60)*60];
          for (i=0; durationInMinutes.length > i; i++) {
            if (durationInMinutes[i].toString().length < 2) {
              durationInMinutes[i] = "0" + durationInMinutes[i].toString()
            }
          }
          connection.play(ytdl(anURL));
          connection.on("error", (error) => {
            connection.disconnect();
            vcChannel.join().then(connection => {
              connection.play(ytdl(anURL));
            })
          })
          let musicalEmbed = new Discord.MessageEmbed()
          .setTitle("Music with Ougi")
          .setAuthor("Ougi [BOT]", client.user.avatarURL())
          .setColor("#230347")
          .setDescription("Now playing")
          .setFooter("musicalEmbed by Ougi", client.user.avatarURL())
          .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
          .setImage(videoImage)
          .setTimestamp()
          .addField(videoTitle, "by " + videoAuthor + "\nDuration: " + durationInMinutes.join(":"));
          msg.channel.send(musicalEmbed).then().catch(console.error);
        });
      }
    });
    return
  }

  else {
    msg.channel.send("Looks like you're not in a voice channel I can join, please get into one.").then().catch(console.error);
    return
  }
}
