module.exports =

function (arguments, msg) {
  var paper = JSON.parse(fs.readFileSync('./newsChannel.txt', 'utf-8', console.error)).reverse();
  var maxIndex = paper.length;
  var index = arguments * 1 - 1;

  if (isNaN(index)) {
    msg.channel.send("Uh, please provide a valid number (news are sorted from last to first) or leave it blank to preview the latest announcement.").then().catch(console.error);
    return
  }

  if (index <= 0) {
    index = 0
  }

  var displayIndex = index + 1;
  if (displayIndex > maxIndex) {
    msg.channel.send("That's not a news index number yet.").then().catch(console.error);
    return
  }

  var news = paper[index];
  let thatType = news.type;
  var spookyConstructor = new Discord.MessageEmbed()
  .setTitle(news.title)
  .setDescription(news.desc)
  .setFooter("newspaperEmbed by Ougi | Date: " + news.sent + " | Page " + displayIndex + " of " + maxIndex)
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
  msg.channel.send(spookyConstructor).catch(console.error)
}
