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
  let arguments = spookySlices.slice(2);
  /*-----------------------------------*/

  if (!msg.guild) {
    msg.channel.send("Huh?! This is not a Discord server. Take me into one!").catch(console.error);
    return
  }

  if (arguments.length < 1) {
    msg.channel.send("Please specify a YouTube link or some keywords to search for in YouTube.")
    return
  }

  let vcChannel = msg.member.voice.channel;

  if (vcChannel == null) {
    msg.channel.send("Looks like you're not in a voice channel I can join, please get into one.").catch(console.error);
    return
  }

  let queueEmbed = new Discord.MessageEmbed()
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
  .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
  .setColor("#230347")
  .setFooter("queueEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
  .setTimestamp();

  if (arguments == "stop") {
    if (vc[msg.guild.id] == undefined) {
      msg.channel.send("Nothing was playing.");
      return
    }
    delete vc[msg.guild.id];
    await vcChannel.leave();
    let response = [":pensive:", "oke, bye", "aight imma head out"];
    msg.channel.send(response[Math.floor(Math.random()*response.length)]).catch(console.error);
    return
  }

  if (arguments == "loop") {
    if (vc[msg.guild.id] == undefined) {
      msg.channel.send("Nothing is playing.");
      return
    }
    if (vc[msg.guild.id].length < 2) {
      msg.channel.send("Nothing is playing.");
      delete vc[msg.guild.id];
      return
    }
    if (vc[msg.guild.id][0].loop) {
      msg.channel.send("Loop was already enabled.");
      return
    }
    vc[msg.guild.id].push(vc[msg.guild.id][1]);
    vc[msg.guild.id][0].loop = true;
    queueEmbed.setTitle("Now looping the queue!");
    msg.channel.send(queueEmbed).catch(console.error);
    return
  }

  if (arguments == "unloop") {
    if (vc[msg.guild.id] == undefined) {
      msg.channel.send("Nothing is playing.");
      return
    }
    if (vc[msg.guild.id].length < 2) {
      msg.channel.send("Nothing is playing.");
      delete vc[msg.guild.id];
      return
    }
    if (!vc[msg.guild.id][0].loop) {
      msg.channel.send("Loop was already disabled.");
      return
    }
    vc[msg.guild.id][0].loop = false;
    vc[msg.guild.id].pop();
    queueEmbed.setTitle("Queue won't loop.");
    msg.channel.send(queueEmbed).catch(console.error);
    return
  }

  if (arguments == "skip") {
    if (vc[msg.guild.id] == undefined) {
      msg.channel.send("Nothing is playing.");
      return
    }
    if (vc[msg.guild.id].length < 2) {
      msg.channel.send("Nothing is playing.");
      delete vc[msg.guild.id];
      return
    }
    vc[msg.guild.id].splice(1, 1);
    await vcChannel.leave();
    if (vc[msg.guild.id].length > 2) {
      queueEmbed.setTitle("Skipped!");
      msg.channel.send(queueEmbed).catch(console.error);
    }
    setTimeout(
      function(){
        ougi.queue(msg, vcChannel).catch(console.error)
      }, 500
    );
    return
  }

  if (arguments[0] == "remove" && arguments.length == 2 || arguments[0] == "rm" && arguments.length == 2) {
    if (vc[msg.guild.id] == undefined) {
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
    if (vc[msg.guild.id].length < 2) {
      msg.channel.send("Nothing is playing.");
      delete vc[msg.guild.id];
      return
    }
    if (index > vc[msg.guild.id].length-1 || vc[msg.guild.id][0].loop && index > vc[msg.guild.id].length-2) {
      msg.channel.send("That's not a queue number yet.");
      return
    }
    vc[msg.guild.id].splice(index, 1);
    if (vc[msg.guild.id].length > 2 || index != 1) {
      queueEmbed.setTitle("Removed song number " + index + ".");
      msg.channel.send(queueEmbed).catch(console.error);
    }
    if (index == 1) {
      if (vc[msg.guild.id][0].loop) {
        vc[msg.guild.id].pop();
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
    if (vc[msg.guild.id] == undefined) {
      msg.channel.send("Nothing is playing.");
      return
    }
    if (vc[msg.guild.id].length < 2) {
      msg.channel.send("Nothing is playing.");
      return
    }
    queueEmbed.setTitle("Queue");
    if (vc[msg.guild.id][0].loop) {
      queueEmbed.setDescription("Loop is enabled");
    }
    for (i = 1; i < vc[msg.guild.id].length; i++) {
      if (vc[msg.guild.id][0].loop && i == vc[msg.guild.id].length-1) {
        queueEmbed.addField("\u200b", "...")
      }
      else {
        let anURL = "https://www.youtube.com/watch?v=" + vc[msg.guild.id][i].id;
        let videoImage = vc[msg.guild.id][i].thumbnail;
        let videoAuthor = vc[msg.guild.id][i].channel.name;
        let videoTitle = vc[msg.guild.id][i].title;
        if (i == 1) {
          videoTitle = "► 1.  " + videoTitle;
        }
        else {
          videoTitle = i + ".  " + videoTitle;
        }
        let durationInMilliseconds = vc[msg.guild.id][i].duration * 1000;
        let durationInMinutes = [Math.floor(vc[msg.guild.id][i].duration / 60), vc[msg.guild.id][i].duration - Math.floor(vc[msg.guild.id][i].duration / 60)*60];
        for (j=0; durationInMinutes.length > j; j++) {
          if (durationInMinutes[j].toString().length < 2) {
            durationInMinutes[j] = "0" + durationInMinutes[j].toString()
          }
        }
        queueEmbed.addField(videoTitle, "`" + durationInMinutes.join(":") + "`\nby " + videoAuthor + "\n[View in YouTube](" + anURL + " '" + videoTitle + "')");
      }
    }
    msg.channel.send(queueEmbed).catch(console.error);
    return
  }

  if (vcChannel.full) {
    msg.channel.send("That voice channel is full, so I can't join.").catch(console.error);
    return
  }

  if (vcChannel.joinable) {
    let keywords = arguments.join(" ");
    if (vc[msg.guild.id] == undefined) {
      vc[msg.guild.id] = [{
        loop: false
      }];
    }
    let aVideoMeta = undefined;
    if (keywords.toLowerCase().replace("https://", "").replace("www.", "").replace("youtu.be/", "youtube.com/watch?v=").startsWith("youtube.com/watch?v=")) {
      let myVideoIDLENGTH = keywords.length - keywords.toLowerCase().replace("https://", "").replace("www.", "").replace("youtu.be/", "").replace("youtube.com/watch?v=", "").length;
      let myVideoID = keywords.slice(myVideoIDLENGTH);
      await scrapeYt.getVideo(myVideoID).then(video => {
        if (video.id == undefined) {
          queueEmbed.setTitle("The following video is either unavailable or non-existent");
          queueEmbed.addField("\u200b", keywords.slice(0, 1024));
          msg.channel.send(queueEmbed).catch(console.error);
          return
        }
        aVideoMeta = video;
      });
    }
    else {
      await scrapeYt.search(keywords, {
        type: "video",
        limit: 10
      }).then(async (videos) => {
        if (videos.length > 1) {
          for (x = 0; x < videos.length; x++) {
            try {
              await ytdl.getBasicInfo("https://www.youtube.com/watch?v=" + videos[x].id);
              aVideoMeta = videos[x];
              break;
            }
            catch (e) {
              ougi.globalLog('Skipping video with ID ' + videos[x].id + ' because of an error\n' + e);
            }
          }
        }
        if (aVideoMeta === undefined) {
          queueEmbed.setTitle("I wasn't able to play");
          queueEmbed.addField("\u200b", keywords.slice(0, 1024));
          msg.channel.send(queueEmbed).catch(console.error);
          return
        }
      });
    }
    let pos = vc[msg.guild.id].length;
    if (vc[msg.guild.id][0].loop) {
      vc[msg.guild.id].splice(vc[msg.guild.id].length-1, 0, aVideoMeta);
      pos--;
    }
    else {
      vc[msg.guild.id].push(aVideoMeta);
    }
    queueEmbed.setTitle("Added to queue at position " + pos);
    let anURL = "https://www.youtube.com/watch?v=" + aVideoMeta.id;
    let videoImage = aVideoMeta.thumbnail;
    let videoAuthor = aVideoMeta.channel.name;
    let videoTitle = aVideoMeta.title;
    let durationInMilliseconds = aVideoMeta.duration * 1000;
    let durationInMinutes = [Math.floor(aVideoMeta.duration / 60), aVideoMeta.duration - Math.floor(aVideoMeta.duration / 60)*60];
    for (i=0; durationInMinutes.length > i; i++) {
      if (durationInMinutes[i].toString().length < 2) {
        durationInMinutes[i] = "0" + durationInMinutes[i].toString()
      }
    }
    queueEmbed.addField(videoTitle, "`" + durationInMinutes.join(":") + "`\nby " + videoAuthor + "\n[View in YouTube](" + anURL + " '" + videoTitle + "')");
    if (vc[msg.guild.id].length == 2) {
      ougi.queue(msg, vcChannel).catch(console.error)
    }
    else {
      msg.channel.send(queueEmbed).catch(console.error)
    }
    return
  }

  else {
    msg.channel.send("Looks like you're not in a voice channel I can join, please get into one.").catch(console.error);
    return
  }
}
