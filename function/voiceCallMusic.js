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

  if (arguments == "stop") {
    let listPath = './vc/' + msg.guild.id + '.txt';
    if (!fs.existsSync(listPath)) {
      msg.channel.send("Nothing was playing.");
      return
    }
    let thisFile = fs.readFileSync(listPath, console.error);
    let aList = JSON.parse(thisFile);
    if (aList.length < 1) {
      msg.channel.send("Nothing was playing.");
      return
    }
    fs.unlinkSync(listPath);
    await vcChannel.leave();
    var response = [":pensive:", "oke, bye", "aight imma head out"];
    msg.channel.send(response[Math.floor(Math.random()*response.length)]).then().catch(console.error);
    return
  }

  if (arguments == "skip") {
    let listPath = './vc/' + msg.guild.id + '.txt';
    if (!fs.existsSync(listPath)) {
      msg.channel.send("Nothing was playing.");
      return
    }
    let thisFile = fs.readFileSync(listPath, console.error);
    let aList = JSON.parse(thisFile);
    if (aList.length < 1) {
      msg.channel.send("Nothing was playing.");
      return
    }
    aList.shift();
    fs.writeFileSync(listPath, JSON.stringify(aList), console.error);
    await vcChannel.leave();
    let queueEmbed = new Discord.MessageEmbed()
    .setTitle("Skipped!")
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
    .setAuthor("Ougi [BOT]", client.user.avatarURL())
    .setColor("#230347")
    .setFooter("queueEmbed by Ougi", client.user.avatarURL())
    .setTimestamp();
    msg.channel.send(queueEmbed).then().catch(console.error);
    setTimeout(
      function(){
        ougi.queue(msg, vcChannel).catch(console.error)
      }, 500
    )
    return
  }

  if (arguments == "list" || arguments == "queue" || arguments == "playlist") {
    let listPath = './vc/' + msg.guild.id + '.txt';
    if (!fs.existsSync(listPath)) {
      msg.channel.send("Nothing was playing.");
      return
    }
    let thisFile = fs.readFileSync(listPath, console.error);
    let aList = JSON.parse(thisFile);
    if (aList.length < 1) {
      msg.channel.send("Nothing is playing.");
      return
    }
    let queueEmbed = new Discord.MessageEmbed()
    .setTitle("Queue")
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
    .setAuthor("Ougi [BOT]", client.user.avatarURL())
    .setColor("#230347")
    .setFooter("queueEmbed by Ougi", client.user.avatarURL())
    .setTimestamp();
    for (i = 0; i < aList.length; i++) {
      if (aList[i].keywords.toLowerCase().replace("https://", "").replace("www.", "").replace("youtu.be/", "youtube.com/watch?v=").startsWith("youtube.com/watch?v=")) {
        var myVideoIDLENGTH = aList[i].keywords.length - aList[i].keywords.toLowerCase().replace("https://", "").replace("www.", "").replace("youtu.be/", "").replace("youtube.com/watch?v=", "").length;
        var myVideoID = aList[i].keywords.slice(myVideoIDLENGTH);
        scrapeYt.getVideo(myVideoID).then(video => {
          if (video.id != undefined) {
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
          }
        });
      }
      else {
        scrapeYt.search(aList[i].keywords, {
          type: "video",
          limit: 1
        }).then(videos => {
          if (videos.length >= 1) {
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
            queueEmbed.addField(videoTitle, "by " + videoAuthor + "\nDuration: " + durationInMinutes.join(":") + "\n[View in YouTube](" + anURL + " '" + videoTitle + "')");
          }
        });
      }
    }
    msg.channel.send("*Wait a moment, generating your playlist...*").then((message) => {
      setTimeout(function () {
        message.delete().catch(O_o=>{});
        msg.channel.send(queueEmbed).then().catch(console.error);
      }, 5000, message)
    }).catch(console.error);
    return
  }

  if (vcChannel.full) {
    msg.channel.send("That voice channel is full, so I can't join.").then().catch(console.error);
    return
  }

  if (vcChannel.joinable) {
    let keywords = arguments.join(" ");
    let listPath = './vc/' + msg.guild.id + '.txt';
    if (fs.existsSync(listPath)) {
      let thisFile = fs.readFileSync(listPath, console.error);
      var myList = JSON.parse(thisFile);
    }
    else {
      var myList = [];
    }
    myList.push(
      {
        keywords: keywords,
        initiated: null
      }
    );
    let queueEmbed = new Discord.MessageEmbed()
    .setTitle("Added to queue at position " + myList.length)
    .setAuthor("Ougi [BOT]", client.user.avatarURL())
    .setColor("#230347")
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
    .setFooter("queueEmbed by Ougi", client.user.avatarURL())
    .setTimestamp();
    if (keywords.toLowerCase().replace("https://", "").replace("www.", "").replace("youtu.be/", "youtube.com/watch?v=").startsWith("youtube.com/watch?v=")) {
      var myVideoIDLENGTH = keywords.length - keywords.toLowerCase().replace("https://", "").replace("www.", "").replace("youtu.be/", "").replace("youtube.com/watch?v=", "").length;
      var myVideoID = keywords.slice(myVideoIDLENGTH);
      scrapeYt.getVideo(myVideoID).then(video => {
        if (video.id == undefined) {
          queueEmbed.setTitle("The following video is either unavailable or non-existent");
          queueEmbed.addField("\u200b", keywords.slice(0, 1024));
          msg.channel.send(queueEmbed).then().catch(console.error);
          return
        }
        else {
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
        }
        if (myList.length != 1) {
          msg.channel.send(queueEmbed).then().catch(console.error);
        }
        fs.writeFileSync(listPath, JSON.stringify(myList), console.error);
        if (myList.length == 1) {
          ougi.queue(msg, vcChannel).catch(console.error)
        }
      });
    }
    else {
      scrapeYt.search(keywords, {
        type: "video",
        limit: 1
      }).then(videos => {
        if (videos.length < 1) {
          queueEmbed.setTitle("The following video is either unavailable or non-existent");
          queueEmbed.addField("\u200b", keywords.slice(0, 1024));
          msg.channel.send(queueEmbed).then().catch(console.error);
          return
        }
        else {
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
          queueEmbed.addField(videoTitle, "by " + videoAuthor + "\nDuration: " + durationInMinutes.join(":") + "\n[View in YouTube](" + anURL + " '" + videoTitle + "')");
        }
        if (myList.length != 1) {
          msg.channel.send(queueEmbed).then().catch(console.error);
        }
        fs.writeFileSync(listPath, JSON.stringify(myList), console.error);
        if (myList.length == 1) {
          ougi.queue(msg, vcChannel).catch(console.error)
        }
      });
    }
    return
  }

  else {
    msg.channel.send("Looks like you're not in a voice channel I can join, please get into one.").then().catch(console.error);
    return
  }
}
