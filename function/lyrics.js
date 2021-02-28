module.exports =

async function (arguments, msg) {
  let lyricsEmbed = new Discord.MessageEmbed()
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setFooter("lyricsEmbed by Ougi", client.user.avatarURL())
  .setTimestamp();

  if (arguments.length < 1) {
    if (!msg.guild) {
      msg.channel.send("Huh?! This is not a Discord server. Take me into one!").catch(console.error);
      return
    }
    if (vc[msg.guild.id] == undefined) {
      msg.channel.send("Nothing is playing.");
      return
    }
    if (vc[msg.guild.id].length < 2) {
      msg.channel.send("Nothing is playing.");
      return
    }
    await ksoft.lyrics.get(
      vc[msg.guild.id][1].title
    ).then(track => {
      lyricsEmbed.setTitle(track.name);
      while (track.lyrics.includes('  ')) {
        track.lyrics = track.lyrics.replace('  ', ' ')
      }
      let laLetra = track.lyrics.split("\n\n");
      for (i=0; laLetra.length > i && i < 25; i++) {
        if (laLetra[i].length < 1) {
          laLetra[i] = "\u200b";
        }
        if (i == 0) {
          lyricsEmbed.addField("by " + track.artist.name, laLetra[i]);
        }
        else {
          lyricsEmbed.addField("\u200b", laLetra[i]);
        }
      }
      msg.channel.send(lyricsEmbed).catch(console.error);
    }).catch(console.error);
  }
  else {
    await ksoft.lyrics.get(
      arguments.join(" ")
    ).then(track => {
      lyricsEmbed.setTitle(track.name);
      while (track.lyrics.includes('  ')) {
        track.lyrics = track.lyrics.replace('  ', ' ')
      }
      let laLetra = track.lyrics.split("\n\n");
      for (i=0; laLetra.length > i && i < 25; i++) {
        if (laLetra[i].length < 1) {
          laLetra[i] = "\u200b";
        }
        else if (laLetra[i].length > 1024) {
          laLetra.splice(i, 0, laLetra[i].slice(1024));
          laLetra[i] = laLetra[i].substring(0, 1024);
        }
        if (i == 0) {
          lyricsEmbed.addField("by " + track.artist.name, laLetra[i]);
        }
        else {
          lyricsEmbed.addField("\u200b", laLetra[i]);
        }
      }
      msg.channel.send(lyricsEmbed).catch(console.error);
    }).catch(console.error);
  }
}
