module.exports =

async function (arguments, msg) {
  let emojiIDList = await client.emojis.cache.filter(emoji => emoji.available).map((e) => e.toString());
  let emojiNameList = await client.emojis.cache.filter(emoji => emoji.available).map((e) => e.name);
  let howMany = emojiIDList.length;
  let pageMax = Math.ceil(howMany / 14);
  let page = arguments * 1 - 1;

  if (isNaN(page)) {
    msg.channel.send("Uh, please provide a page number.").then().catch(console.error);
    return
  }

  if (page <= 0) {
    page = 0
  }

  let displayPage = page + 1;
  if (displayPage > pageMax) {
    msg.channel.send("That's not a page yet.").then().catch(console.error);
    return
  }

  let newList = ougi.miniArrays(emojiIDList, 14);
  let newNameList = ougi.miniArrays(emojiNameList, 14);
  let willShow = newList[page];
  let willShowN = newNameList[page];
  let embed = new Discord.MessageEmbed()
    .setTitle("spookyEmoji List | Page " + displayPage)
    .setColor("#C93A57")
    .setFooter("spookyEmoji List by Ougi [" + howMany + " emoji in " + pageMax +" pages]", client.user.avatarURL());
    for (i = 0; i < willShow.length; i+=2) {
      if (willShow[i+1] == undefined) {
        willShow[i+1] = "\u200b";
        willShowN[i+1] = "\u200b";
      }
      embed.addField(willShow[i] + " `" + willShowN[i] + "`", willShow[i+1] + " `" + willShowN[i+1] + "`")
    };

  msg.channel.send({embed}).then().catch(console.error);
}
