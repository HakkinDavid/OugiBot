module.exports =

async function (arguments, msg) {
  let lyricsEmbed = new Discord.EmbedBuilder()
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougimusic.png?raw=true")
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setFooter({text: "lyricsEmbed by Ougi | Lyrics provided by KSoft.Si API", icon: client.user.avatarURL({dynamic: true, size: 4096})});

  if (arguments.length < 1) {
    if (!msg.guild) {
      msg.channel.send("Huh?! This is not a Discord server. Take me into one!").catch(console.error);
      return
    }
    if (vc[msg.guildId] == undefined) {
      msg.channel.send("Nothing is playing.");
      return
    }
    if (vc[msg.guildId].length < 2) {
      msg.channel.send("Nothing is playing.");
      return
    }
    await ksoft.lyrics.get(
      vc[msg.guildId][1].title
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
          lyricsEmbed.addFields({name: "by " + track.artist.name, value: laLetra[i]});
        }
        else {
          lyricsEmbed.addFields({name: "\u200b", value: laLetra[i]});
        }
      }
      msg.channel.send({embeds: [lyricsEmbed]}).catch(console.error);
    }).catch(console.error);
  }
  else {
    try {
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
            lyricsEmbed.addFields({name: "by " + track.artist.name, value: laLetra[i]});
          }
          else {
            lyricsEmbed.addFields({name: "\u200b", value: laLetra[i]});
          }
        }
        msg.channel.send({embeds: [lyricsEmbed]}).catch(console.error);
      });
    }
    catch (e) {
      console.error(e);
      msg.channel.send("Lyrics aren't available right now.");
    }
  }
}
