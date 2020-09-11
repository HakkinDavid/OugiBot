module.exports =

async function (msg, vcChannel) {
  let internalDate = new Date().getTime();
  let listPath = './vc/' + msg.guild.id + '.txt';
  if (fs.existsSync(listPath)) {
    let thisFile = fs.readFileSync(listPath, console.error);
    var myList = JSON.parse(thisFile);
    if (myList.length >= 1) {
      myList[0].initiated = internalDate;
      fs.writeFileSync(listPath, JSON.stringify(myList), console.error);
    }
  }
  else {
    var myList = [];
  }
  if (myList.length < 1) {
    let queueEmbed = new Discord.MessageEmbed()
    .setTitle("Queue is over!")
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
    .setAuthor("Ougi [BOT]", client.user.avatarURL())
    .setColor("#230347")
    .setFooter("queueEmbed by Ougi", client.user.avatarURL())
    .setTimestamp();
    msg.channel.send(queueEmbed).then().catch(console.error);
    await vcChannel.leave();
    return
  }
  await vcChannel.join().then(connection => {
    if (myList[0].keywords.toLowerCase().replace("https://", "").replace("www.", "").replace("youtu.be/", "youtube.com/watch?v=").startsWith("youtube.com/watch?v=")) {
      var myVideoIDLENGTH = myList[0].keywords.length - myList[0].keywords.toLowerCase().replace("https://", "").replace("www.", "").replace("youtu.be/", "").replace("youtube.com/watch?v=", "").length;
      var myVideoID = myList[0].keywords.slice(myVideoIDLENGTH);
      scrapeYt.getVideo(myVideoID).then(video => {
        if (video.id == undefined) {
          let listPath = './vc/' + msg.guild.id + '.txt';
          let thisFile = fs.readFileSync(listPath, console.error);
          let aList = JSON.parse(thisFile);
          aList.shift();
          fs.writeFileSync(listPath, JSON.stringify(aList), console.error);
          vcChannel.leave();
          let queueEmbed = new Discord.MessageEmbed()
          .setTitle("The following video is either unavailable or non-existent.")
          .setDescription(myList[0].keywords)
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
        setTimeout(function () {
          let thisFile = fs.readFileSync(listPath, console.error);
          var aList = JSON.parse(thisFile);
          var thisDate = aList[0].initiated;
          if (internalDate == thisDate) {
            aList.shift();
            fs.writeFileSync(listPath, JSON.stringify(aList), console.error);
            ougi.queue(msg, vcChannel);
          }
        }, durationInMilliseconds + 2000);
        let musicalEmbed = new Discord.MessageEmbed()
        .setTitle("Music with Ougi")
        .setAuthor("Ougi [BOT]", client.user.avatarURL())
        .setColor("#230347")
        .setDescription("Now playing")
        .setFooter("musicalEmbed by Ougi", client.user.avatarURL())
        .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
        .setImage(videoImage)
        .setTimestamp()
        .addField(videoTitle, "by " + videoAuthor + "\nDuration: " + durationInMinutes.join(":") + "\n[View in YouTube](" + anURL + " '" + videoTitle + "')");
        msg.channel.send(musicalEmbed).then().catch(console.error);
      });
    }
    else {
      scrapeYt.search(myList[0].keywords, {
        type: "video",
        limit: 1
      }).then(videos => {
        if (videos.length < 1) {
          let listPath = './vc/' + msg.guild.id + '.txt';
          let thisFile = fs.readFileSync(listPath, console.error);
          let aList = JSON.parse(thisFile);
          aList.shift();
          fs.writeFileSync(listPath, JSON.stringify(aList), console.error);
          vcChannel.leave();
          let queueEmbed = new Discord.MessageEmbed()
          .setTitle("The following video is either unavailable or non-existent.")
          .setDescription(myList[0].keywords)
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
        setTimeout(function () {
          let thisFile = fs.readFileSync(listPath, console.error);
          var aList = JSON.parse(thisFile);
          var thisDate = aList[0].initiated;
          if (internalDate == thisDate) {
            aList.shift();
            fs.writeFileSync(listPath, JSON.stringify(aList), console.error);
            ougi.queue(msg, vcChannel).catch(console.error);
          }
        }, durationInMilliseconds + 2000);
        let musicalEmbed = new Discord.MessageEmbed()
        .setTitle("Music with Ougi")
        .setAuthor("Ougi [BOT]", client.user.avatarURL())
        .setColor("#230347")
        .setDescription("Now playing")
        .setFooter("musicalEmbed by Ougi", client.user.avatarURL())
        .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
        .setImage(videoImage)
        .setTimestamp()
        .addField(videoTitle, "`" + durationInMinutes.join(":") + "`\nby " + videoAuthor + "\n[View in YouTube](" + anURL + " '" + videoTitle + "')");
        msg.channel.send(musicalEmbed).then().catch(console.error);
      });
    }
  });
}
