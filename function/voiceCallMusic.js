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
  let spookyCake = msg.content;
  let spookySlices = spookyCake.split(" ");
  let spookyCommand = spookySlices[1];
  let arguments = spookySlices.slice(2);
  /*-----------------------------------*/

  if (!msg.guild) {
    msg.channel.send("Huh?! This is not a Discord server. Take me into one!").then().catch(console.error);
    return
  }

  if (arguments.length < 1) {
    msg.channel.send("Please specify a YouTube link or some keywords to search for in YouTube.")
    return
  }

  let vcChannel = msg.member.voice.channel;

  if (vcChannel == null) {
    msg.channel.send("Looks like you're not in a voice channel I can join, please get into one.").then().catch(console.error);
    return
  }

  let queueEmbed = new Discord.MessageEmbed()
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setFooter("queueEmbed by Ougi", client.user.avatarURL())
  .setTimestamp();

  let listPath = './vc/' + msg.guild.id + '.txt';

  if (arguments == "stop") {
    if (!fs.existsSync(listPath)) {
      msg.channel.send("Nothing was playing.");
      return
    }
    let thisFile = fs.readFileSync(listPath, console.error);
    let aList = JSON.parse(thisFile);
    if (aList.length < 2) {
      msg.channel.send("Nothing was playing.");
      return
    }
    fs.unlinkSync(listPath);
    await vcChannel.leave();
    var response = [":pensive:", "oke, bye", "aight imma head out"];
    msg.channel.send(response[Math.floor(Math.random()*response.length)]).then().catch(console.error);
    return
  }

  if (arguments == "loop") {
    if (!fs.existsSync(listPath)) {
      msg.channel.send("Nothing is playing.");
      return
    }
    let thisFile = fs.readFileSync(listPath, console.error);
    let aList = JSON.parse(thisFile);
    if (aList.length < 2) {
      msg.channel.send("Nothing is playing.");
      return
    }
    if (aList[0].loop) {
      msg.channel.send("Loop was already enabled.");
      return
    }
    aList.push(aList[1]);
    aList[0].loop = true;
    fs.writeFileSync(listPath, JSON.stringify(aList), console.error);
    queueEmbed.setTitle("Now looping the queue!");
    msg.channel.send(queueEmbed).then().catch(console.error);
    return
  }

  if (arguments == "unloop") {
    if (!fs.existsSync(listPath)) {
      msg.channel.send("Nothing is playing.");
      return
    }
    let thisFile = fs.readFileSync(listPath, console.error);
    let aList = JSON.parse(thisFile);
    if (aList.length < 2) {
      msg.channel.send("Nothing is playing.");
      return
    }
    if (!aList[0].loop) {
      msg.channel.send("Loop was already disabled.");
      return
    }
    aList[0].loop = false;
    aList.pop();
    fs.writeFileSync(listPath, JSON.stringify(aList), console.error);
    queueEmbed.setTitle("Queue won't loop.");
    msg.channel.send(queueEmbed).then().catch(console.error);
    return
  }

  if (arguments == "skip") {
    if (!fs.existsSync(listPath)) {
      msg.channel.send("Nothing is playing.");
      return
    }
    let thisFile = fs.readFileSync(listPath, console.error);
    let aList = JSON.parse(thisFile);
    if (aList.length < 2) {
      msg.channel.send("Nothing is playing.");
      return
    }
    aList.splice(1, 1);
    fs.writeFileSync(listPath, JSON.stringify(aList), console.error);
    await vcChannel.leave();
    if (aList.length > 2) {
      queueEmbed.setTitle("Skipped!");
      msg.channel.send(queueEmbed).then().catch(console.error);
    }
    setTimeout(
      function(){
        ougi.queue(msg, vcChannel).catch(console.error)
      }, 500
    );
    return
  }

  if (arguments[0] == "remove" && arguments.length == 2 || arguments[0] == "rm" && arguments.length == 2) {
    if (!fs.existsSync(listPath)) {
      msg.channel.send("Nothing is playing.");
      return
    }
    if (isNaN(arguments[1])) {
      msg.channel.send("Please specify a song number from the queue.");
      return
    }
    let index = arguments[1];
    if (index < 1) {
      index = 1;
    }
    let thisFile = fs.readFileSync(listPath, console.error);
    let aList = JSON.parse(thisFile);
    if (aList.length < 2) {
      msg.channel.send("Nothing is playing.");
      return
    }
    if (index > aList.length-1 || aList[0].loop && index > aList.length-2) {
      msg.channel.send("That's not a queue number yet.");
      return
    }
    aList.splice(index, 1);
    fs.writeFileSync(listPath, JSON.stringify(aList), console.error);
    if (aList.length > 2 || index != 1) {
      queueEmbed.setTitle("Removed song number " + index + ".");
      msg.channel.send(queueEmbed).then().catch(console.error);
    }
    if (index == 1) {
      if (aList[0].loop) {
        aList.pop();
        fs.writeFileSync(listPath, JSON.stringify(aList), console.error);
      }
      await vcChannel.leave();
      setTimeout(
        function(){
          ougi.queue(msg, vcChannel).catch(console.error)
        }, 500
      );
    }
    return
  }

  if (arguments == "list" || arguments == "queue" || arguments == "playlist") {
    if (!fs.existsSync(listPath)) {
      msg.channel.send("Nothing is playing.");
      return
    }
    let thisFile = fs.readFileSync(listPath, console.error);
    let aList = JSON.parse(thisFile);
    if (aList.length < 2) {
      msg.channel.send("Nothing is playing.");
      return
    }
    queueEmbed.setTitle("Queue");
    if (aList[0].loop) {
      queueEmbed.setDescription("Loop is enabled");
    }
    for (i = 1; i < aList.length; i++) {
      if (aList[0].loop && i == aList.length-1) {
        queueEmbed.addField("\u200b", "...")
      }
      else {
        let anURL = "https://www.youtube.com/watch?v=" + aList[i].id;
        let videoImage = aList[i].thumbnail;
        let videoAuthor = aList[i].channel.name;
        let videoTitle = aList[i].title;
        if (i == 1) {
          videoTitle = "► 1.  " + videoTitle;
        }
        else {
          videoTitle = i + ".  " + videoTitle;
        }
        let durationInMilliseconds = aList[i].duration * 1000;
        let durationInMinutes = [Math.floor(aList[i].duration / 60), aList[i].duration - Math.floor(aList[i].duration / 60)*60];
        for (j=0; durationInMinutes.length > j; j++) {
          if (durationInMinutes[j].toString().length < 2) {
            durationInMinutes[j] = "0" + durationInMinutes[j].toString()
          }
        }
        queueEmbed.addField(videoTitle, "`" + durationInMinutes.join(":") + "`\nby " + videoAuthor + "\n[View in YouTube](" + anURL + " '" + videoTitle + "')");
      }
    }
    msg.channel.send(queueEmbed).then().catch(console.error);
    return
  }

  if (vcChannel.full) {
    msg.channel.send("That voice channel is full, so I can't join.").then().catch(console.error);
    return
  }

  if (vcChannel.joinable) {
    let keywords = arguments.join(" ");
    if (fs.existsSync(listPath)) {
      let thisFile = fs.readFileSync(listPath, console.error);
      var myList = JSON.parse(thisFile);
    }
    else {
      var myList = [{
        loop: false
      }];
    }
    if (keywords.toLowerCase().replace("https://", "").replace("www.", "").replace("youtu.be/", "youtube.com/watch?v=").startsWith("youtube.com/watch?v=")) {
      let myVideoIDLENGTH = keywords.length - keywords.toLowerCase().replace("https://", "").replace("www.", "").replace("youtu.be/", "").replace("youtube.com/watch?v=", "").length;
      let myVideoID = keywords.slice(myVideoIDLENGTH);
      scrapeYt.getVideo(myVideoID).then(video => {
        if (video.id == undefined) {
          queueEmbed.setTitle("The following video is either unavailable or non-existent");
          queueEmbed.addField("\u200b", keywords.slice(0, 1024));
          msg.channel.send(queueEmbed).then().catch(console.error);
          return
        }
        else {
          let pos = myList.length;
          if (myList[0].loop) {
            myList.splice(myList.length-1, 0, video);
            pos--;
          }
          else {
            myList.push(video);
          }
          queueEmbed.setTitle("Added to queue at position " + pos);
          let anURL = "https://www.youtube.com/watch?v=" + video.id;
          let videoImage = video.thumbnail;
          let videoAuthor = video.channel.name;
          let videoTitle = video.title;
          let durationInMilliseconds = video.duration * 1000;
          let durationInMinutes = [Math.floor(video.duration / 60), video.duration - Math.floor(video.duration / 60)*60];
          for (i=0; durationInMinutes.length > i; i++) {
            if (durationInMinutes[i].toString().length < 2) {
              durationInMinutes[i] = "0" + durationInMinutes[i].toString()
            }
          }
          queueEmbed.addField(videoTitle, "`" + durationInMinutes.join(":") + "`\nby " + videoAuthor + "\n[View in YouTube](" + anURL + " '" + videoTitle + "')");
        }

        fs.writeFileSync(listPath, JSON.stringify(myList), console.error);
        if (myList.length == 2) {
          ougi.queue(msg, vcChannel).catch(console.error)
        }

        else {
          msg.channel.send(queueEmbed).then().catch(console.error)
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
          let pos = myList.length;
          if (myList[0].loop) {
            myList.splice(myList.length-1, 0, videos[0]);
            pos--;
          }
          else {
            myList.push(videos[0]);
          }
          queueEmbed.setTitle("Added to queue at position " + pos);
          let anURL = "https://www.youtube.com/watch?v=" + videos[0].id;
          let videoImage = videos[0].thumbnail;
          let videoAuthor = videos[0].channel.name;
          let videoTitle = videos[0].title;
          let durationInMilliseconds = videos[0].duration * 1000;
          let durationInMinutes = [Math.floor(videos[0].duration / 60), videos[0].duration - Math.floor(videos[0].duration / 60)*60];
          for (i=0; durationInMinutes.length > i; i++) {
            if (durationInMinutes[i].toString().length < 2) {
              durationInMinutes[i] = "0" + durationInMinutes[i].toString()
            }
          }
          queueEmbed.addField(videoTitle, "`" + durationInMinutes.join(":") + "`\nby " + videoAuthor + "\n[View in YouTube](" + anURL + " '" + videoTitle + "')");
        }

        fs.writeFileSync(listPath, JSON.stringify(myList), console.error);
        if (myList.length == 2) {
          ougi.queue(msg, vcChannel).catch(console.error)
        }

        else {
          msg.channel.send(queueEmbed).then().catch(console.error)
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
