module.exports =

async function (arguments, msg) {
  let paper = ougi.db().loadNews().slice().reverse();
  let maxIndex = paper.length;
  let index = arguments * 1 - 1;

  if (isNaN(index)) {
    msg.channel.send(await ougi.text({ msg, stringID: "news_invalidNumber" })).catch(console.error);
    return;
  }

  if (index <= 0) {
    index = 0;
  }

  let displayIndex = index + 1;
  if (displayIndex > maxIndex) {
    msg.channel.send(await ougi.text({ msg, stringID: "news_indexOutOfRange" })).catch(console.error);
    return;
  }

  let news = paper[index];
  let thatType = news.type;
  const renderedFooter = await ougi.text({
    msg,
    stringID: "news_footerFormat",
    values: {
      sent: news.sent,
      page: displayIndex,
      max: maxIndex
    }
  });

  let spookyConstructor = new Discord.EmbedBuilder()
  .setTitle(news.title)
  .setDescription(news.desc)
  .setFooter({text: renderedFooter})
  .setColor("#F5F2F2")
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/news.png?raw=true");
  if (thatType == "info") {
    spookyConstructor
    .setColor("#1C22C9")
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/info.png?raw=true");
  }
  else if (thatType == "mail") {
    spookyConstructor
    .setColor("#F5F2F2")
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/news.png?raw=true");
  }
  else if (thatType == "alert") {
    spookyConstructor
    .setColor("#C9A71C")
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/doritoalert.png?raw=true");
  }
  else if (thatType == "fatal") {
    spookyConstructor
    .setColor("#FC0000")
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/fatal.png?raw=true");
  }
  msg.channel.send({embeds: [spookyConstructor]}).catch(console.error);
}
