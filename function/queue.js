module.exports =

async function (msg, vcChannel) {
  let internalDate = new Date().getTime();
  if (vc[msg.guild.id].length >= 2) {
      vc[msg.guild.id][1].initiated = internalDate;
  }
  if (vc[msg.guild.id].length < 2) {
    let queueEmbed = new Discord.MessageEmbed()
    .setTitle("Queue is over!")
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
    .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
    .setColor("#230347")
    .setFooter("queueEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
    .setTimestamp();
    msg.channel.send(queueEmbed).catch(console.error);
    await vcChannel.leave();
    return
  }
  if (vc[msg.guild.id][0].loop) {
    vc[msg.guild.id].push(vc[msg.guild.id][1]);
  }
  await vcChannel.join().then(async (connection) => {
    let anURL = "https://www.youtube.com/watch?v=" + vc[msg.guild.id][1].id;
    let videoImage = vc[msg.guild.id][1].thumbnail;
    let videoAuthor = vc[msg.guild.id][1].channel.name;
    let videoTitle = vc[msg.guild.id][1].title;
    let durationInMilliseconds = vc[msg.guild.id][1].duration * 1000;
    let durationInMinutes = [Math.floor(vc[msg.guild.id][1].duration / 60), vc[msg.guild.id][1].duration - Math.floor(vc[msg.guild.id][1].duration / 60)*60];
    for (i=0; durationInMinutes.length > i; i++) {
      if (durationInMinutes[i].toString().length < 2) {
        durationInMinutes[i] = "0" + durationInMinutes[i].toString()
      }
    }
    await connection.play(await ytdl(anURL, { filter: 'audioonly', quality: 'highestaudio' }), { type: 'opus' });
    connection.on("error", async (error) => {
      let queueEmbed = new Discord.MessageEmbed()
      .setTitle("An error occured while playing this video. Seems like it's blocked for external use by YouTube.")
      .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
      .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
      .setColor("#230347")
      .setFooter("queueEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
      .setTimestamp();
      msg.channel.send(queueEmbed).catch(console.error);
      ougi.queue(msg, vcChannel);
    })
    setTimeout(async function () {
      if (vc[msg.guild.id] == undefined || vc[msg.guild.id][1] == undefined) {
        return
      }
      let thisDate = vc[msg.guild.id][1].initiated;
      if (internalDate == thisDate) {
        vc[msg.guild.id].splice(1, 1);
        ougi.queue(msg, vcChannel);
      }
    }, durationInMilliseconds + 2000);
    let musicalEmbed = new Discord.MessageEmbed()
    .setTitle("Music with Ougi")
    .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
    .setColor("#230347")
    .setDescription("Now playing")
    .setFooter("musicalEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
    .setImage(videoImage)
    .setTimestamp()
    .addField(videoTitle, "`" + durationInMinutes.join(":") + "`\nby " + videoAuthor + "\n[View in YouTube](" + anURL + " '" + videoTitle + "')");
    msg.channel.send(musicalEmbed).catch(console.error);
  });
}
