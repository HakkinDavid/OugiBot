module.exports =

async function (arguments, msg) {
  let paper = ougi.readFile(database.news.file, 'utf-8', console.error).reverse();
  let maxIndex = paper.length;
  let index = arguments * 1 - 1;

  if (isNaN(index)) {
    msg.channel.send("Uh, please provide a valid number (news are sorted from last to first) or leave it blank to preview the latest announcement.").catch(console.error);
    return
  }

  if (index <= 0) {
    index = 0
  }

  let displayIndex = index + 1;
  if (displayIndex > maxIndex) {
    msg.channel.send("That's not a news index number yet.").catch(console.error);
    return
  }

  let news = paper[index];
  let thatType = news.type;
  let spookyConstructor = new Discord.EmbedBuilder()
  .setTitle(news.title)
  .setDescription(news.desc)
  .setFooter({text: "newspaperEmbed by Ougi | Date: " + news.sent + " | Page " + displayIndex + " of " + maxIndex})
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
