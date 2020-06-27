module.exports =

function emojiList(arguments, msg) {
  var emojiIDList = client.emojis.filter(emoji => emoji.available).map((e) => e.toString()).then().catch(console.error);
  var emojiNameList = client.emojis.filter(emoji => emoji.available).map((e) => e.name).then().catch(console.error);
  var howMany = emojiIDList.length;
  var pageMax = Math.ceil(howMany / 14);
  var page = arguments * 1 - 1;

  if (isNaN(page)) {
    msg.channel.send("Uh, please provide a page number.").then().catch(console.error).then().catch(console.error);
    return
  }

  if (page <= 0) {
    page = 0
  }

  var displayPage = page + 1;
  if (displayPage > pageMax) {
    msg.channel.send("That's not a page yet.").then().catch(console.error);
    return
  }

  var newList = ougi.miniArrays(emojiIDList, 14);
  var newNameList = ougi.miniArrays(emojiNameList, 14);
  var willShow = newList[page];
  var willShowN = newNameList[page];
  var embed = new Discord.RichEmbed()
    .setTitle("spookyEmoji List | Page " + displayPage)
    .setColor("#C93A57")
    .setFooter("spookyEmoji List by Ougi [" + howMany + " emoji in " + pageMax +" pages]", client.user.avatarURL);
    for (i = 0; i < willShow.length; i+=2) {
      if (willShow[i+1] == undefined) {
        willShow[i+1] = "**END**";
        willShowN[i+1] = "That's all folks.";
      }
      embed.addField(willShow[i] + " `" + willShowN[i] + "`", willShow[i+1] + " `" + willShowN[i+1] + "`")
    };

  msg.channel.send({embed}).then().catch(console.error);
}
