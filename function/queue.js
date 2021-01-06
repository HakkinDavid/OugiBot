module.exports =

async function (msg, vcChannel) {
  let internalDate = new Date().getTime();
  let listPath = './vc/' + msg.guild.id + '.txt';
  if (fs.existsSync(listPath)) {
    let thisFile = fs.readFileSync(listPath, console.error);
    var myList = JSON.parse(thisFile);
    if (myList.length >= 2) {
      myList[1].initiated = internalDate;
      fs.writeFileSync(listPath, JSON.stringify(myList), console.error);
    }
  }
  else {
    var myList = [];
  }
  if (myList.length < 2) {
    fs.unlinkSync(listPath);
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
  if (myList[0].loop) {
    myList.push(myList[1]);
    fs.writeFileSync(listPath, JSON.stringify(myList), console.error);
  }
  await vcChannel.join().then(async (connection) => {
    let anURL = "https://www.youtube.com/watch?v=" + myList[1].id;
    let videoImage = myList[1].thumbnail;
    let videoAuthor = myList[1].channel.name;
    let videoTitle = myList[1].title;
    let durationInMilliseconds = myList[1].duration * 1000;
    let durationInMinutes = [Math.floor(myList[1].duration / 60), myList[1].duration - Math.floor(myList[1].duration / 60)*60];
    for (i=0; durationInMinutes.length > i; i++) {
      if (durationInMinutes[i].toString().length < 2) {
        durationInMinutes[i] = "0" + durationInMinutes[i].toString()
      }
    }
    await connection.play(await ytdl(anURL, { filter: 'audioonly', quality: 'highestaudio' }), { type: 'opus' });
    connection.on("error", (error) => {
      let queueEmbed = new Discord.MessageEmbed()
      .setTitle("An error occured while playing this video. Seems like it's blocked for external use by YouTube.")
      .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
      .setAuthor("Ougi [BOT]", client.user.avatarURL())
      .setColor("#230347")
      .setFooter("queueEmbed by Ougi", client.user.avatarURL())
      .setTimestamp();
      msg.channel.send(queueEmbed).then().catch(console.error);
      connection.disconnect();
      ougi.queue(msg, vcChannel);
    })
    setTimeout(function () {
      if (!fs.existsSync(listPath)) {
        return
      }
      let thisFile = fs.readFileSync(listPath, console.error);
      let aList = JSON.parse(thisFile);
      let thisDate = aList[1].initiated;
      if (internalDate == thisDate) {
        aList.splice(1, 1);
        fs.writeFileSync(listPath, JSON.stringify(aList), console.error);
        connection.disconnect();
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
    .addField(videoTitle, "`" + durationInMinutes.join(":") + "`\nby " + videoAuthor + "\n[View in YouTube](" + anURL + " '" + videoTitle + "')");
    msg.channel.send(musicalEmbed).then().catch(console.error);
  });
}
