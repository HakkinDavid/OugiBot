module.exports =

async function (arguments, msg) {
    if (arguments.length < 1) {
      msg.channel.send(await ougi.text(msg, "keywordRequired")).catch(console.error);
      return;
    }
    let search = arguments.join(" ");
    gis(search, function(error, urls) {
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
            msg.channel.send("There aren't any results.").catch(console.error);
            return;
        }

        let imageToSend = urls[Math.floor(Math.random()*urls.length)].url;

        let spookyImage = new Discord.MessageEmbed()
        .setImage(imageToSend)
        .setFooter("imageEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
        .setTimestamp()
        .setColor("#230347");
        msg.channel.send(spookyImage).catch(console.error);
        client.channels.cache.get(consoleLogging).send(spookyImage);
    });
}
