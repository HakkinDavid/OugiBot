module.exports =

async function (msg) {
  let keywords = ["cute kitties", "cute puppies", "rick astley", "ougi oshino"];
  let search = keywords[Math.floor(Math.random()*keywords.length)];
  await gis(search, async function(error, urls) {
      if (error) {
          console.error(error)
      }

      for (i=0; urls.length > i; i++) {
        if (!isImageUrl(urls[i].url)) {
          urls.splice(i, 1);
          i--
        }
      }

      if (urls.length == 0) {
          msg.channel.send(await ougi.text(msg, "resultsZero")).catch(console.error);
          return;
      }

      let imageToSend = urls[Math.floor(Math.random()*urls.length)].url;

      let embed = await ougi.helpPreset(msg, "image");
      embed.setDescription(await ougi.text(msg, "imageHelpDesc"))
      .addFields({name: await ougi.text(msg, "example"), value: "`ougi image " + search +"`"})
      .setImage(imageToSend)
      .setFooter({text: "helpEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
      .setTimestamp();
      msg.channel.send({embeds: [embed]}).catch(console.error);
      client.channels.cache.get(consoleLogging).send({embeds: [embed]});
  });
}
