module.exports =

async function (arguments, msg) {
    if (arguments.length < 1) {
      msg.channel.send(await ougi.text(msg, "keywordRequired")).catch(console.error);
      return;
    }
    let urls = await gis(arguments.join(" "), {
        query: { safe: (msg.channel.nsfw ? "off" : "on") },
        //userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    });

    for (i=0; urls.length > i; i++) {
      if (!isImageUrl(urls[i].url)) {
        urls.splice(i, 1);
        i--
      }
    }

    if (urls.length === 0) {
        msg.channel.send(await ougi.text(msg, "resultsZero")).catch(console.error);
        return;
    }

    let imageToSend = urls[Math.floor(Math.random()*urls.length)];

    let spookyImage = new Discord.MessageEmbed()
    .setImage(imageToSend.url)
    .setFooter("imageEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
    .setTimestamp()
    .setColor(imageToSend.color);
    msg.channel.send(spookyImage).catch(console.error);
    client.channels.cache.get(consoleLogging).send(spookyImage);
}
