module.exports =

async function (msg, vcChannel) {
  let internalDate = new Date().getTime();
  if (vc[msg.guildId].length >= 2) {
      vc[msg.guildId][1].initiated = internalDate;
  }
  if (vc[msg.guildId].length < 2) {
    let queueEmbed = new Discord.EmbedBuilder()
    .setTitle("Queue is over!")
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
    .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
    .setColor("#230347")
    .setFooter({text: "queueEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
    .setTimestamp();
    msg.channel.send({embeds: [queueEmbed]}).catch(console.error);
    await vcChannel.leave();
    delete vc[msg.guildId];
    return
  }
  if (vc[msg.guildId][0].loop) {
    vc[msg.guildId].push(vc[msg.guildId][1]);
  }
  await vcChannel.join().then(async (connection) => {
    let anURL = "https://www.youtube.com/watch?v=" + vc[msg.guildId][1].id;
    let videoImage = vc[msg.guildId][1].thumbnail;
    let videoAuthor = vc[msg.guildId][1].channel.name;
    let videoTitle = vc[msg.guildId][1].title;
    let durationInMilliseconds = vc[msg.guildId][1].duration * 1000;
    let durationInMinutes = [Math.floor(vc[msg.guildId][1].duration / 60), vc[msg.guildId][1].duration - Math.floor(vc[msg.guildId][1].duration / 60)*60];
    for (i=0; durationInMinutes.length > i; i++) {
      if (durationInMinutes[i].toString().length < 2) {
        durationInMinutes[i] = "0" + durationInMinutes[i].toString()
      }
    }
    await connection.play(await ytdl(anURL, { filter: 'audioonly', quality: 'highestaudio' }), { type: 'opus' });
    connection.on("error", async (error) => {
      let queueEmbed = new Discord.EmbedBuilder()
      .setTitle("An error occured while playing this video. Seems like it's blocked for external use by YouTube.")
      .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
      .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
      .setColor("#230347")
      .setFooter({text: "queueEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
      .setTimestamp();
      msg.channel.send({embeds: [queueEmbed]}).catch(console.error);
      ougi.queue(msg, vcChannel);
    })
    setTimeout(async function () {
      if (vc[msg.guildId] == undefined || vc[msg.guildId][1] == undefined) {
        return
      }
      let thisDate = vc[msg.guildId][1].initiated;
      if (internalDate == thisDate) {
        vc[msg.guildId].splice(1, 1);
        ougi.queue(msg, vcChannel);
      }
    }, durationInMilliseconds + 2000);
    let musicalEmbed = new Discord.EmbedBuilder()
    .setTitle("Music with Ougi")
    .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
    .setColor("#230347")
    .setDescription("Now playing")
    .setFooter({text: "musicalEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
    .setImage(videoImage)
    .setTimestamp()
    .addFields({name: videoTitle, value: "`" + durationInMinutes.join(":") + "`\nby " + videoAuthor + "\n[View in YouTube](" + anURL + " '" + videoTitle + "')"});
    msg.channel.send({embeds: [musicalEmbed]}).catch(console.error);
  });
}
