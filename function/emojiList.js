module.exports =

function emojiList(arguments, msg) {
  var emojiIDList = client.emojis.map((e) => e.toString());
  if (arguments.length == 0 || arguments == "1") {
    var field1 = emojiIDList.slice(0, 23).join(" ");
    var field2 = emojiIDList.slice(23, 46).join(" ");
    var field3 = emojiIDList.slice(46, 69).join(" ");
    var field4 = emojiIDList.slice(69, 92).join(" ");
    var field5 = emojiIDList.slice(92, 115).join(" ");
    var field6 = emojiIDList.slice(115, 138).join(" ");
    var field7 = emojiIDList.slice(138, 161).join(" ");
    var embed = new Discord.RichEmbed()
    .setTitle("SpookyEmoji List")
    .setColor("#C93A57")
    .addField("Emoji Set 1", field1)
    .addField("Emoji Set 2", field2)
    .addField("Emoji Set 3", field3)
    .addField("Emoji Set 4", field4)
    .addField("Emoji Set 5", field5)
    .addField("Emoji Set 6", field6)
    .addField("Emoji Set 7", field7)
    .setFooter("SpookyEmoji List by Ougi [Page 1]", client.user.avatarURL);
    msg.channel.send("These are the emoji I can currently use.\nYou can also browse by page.", {embed});
  }
  else if (arguments == "2") {
    var emojiIDList = client.emojis.map((e) => e.toString());
    var field8 = emojiIDList.slice(161, 184).join(" ");
    var field9 = emojiIDList.slice(184, 207).join(" ");
    var field10 = emojiIDList.slice(207, 230).join(" ");
    var field11 = emojiIDList.slice(230, 253).join(" ");
    var field12 = emojiIDList.slice(253, 276).join(" ");
    var field13 = emojiIDList.slice(276, 299).join(" ");
    var field14 = emojiIDList.slice(299, 322).join(" ");
    var embed = new Discord.RichEmbed()
    .setTitle("SpookyEmoji List")
    .setColor("#933AC9")
    .addField("Emoji Set 8", field8)
    .addField("Emoji Set 9", field9)
    .addField("Emoji Set 10", field10)
    .addField("Emoji Set 11", field11)
    .addField("Emoji Set 12", field12)
    .addField("Emoji Set 13", field13)
    .addField("Emoji Set 14", field14)
    .setFooter("SpookyEmoji List by Ougi [Page 2]", client.user.avatarURL);
    msg.channel.send("These are the emoji I can currently use.\nYou can also browse by page.", {embed});
  }
  else if (arguments == "3") {
    var emojiIDList = client.emojis.map((e) => e.toString());
    var field15 = emojiIDList.slice(322, 345).join(" ");
    var field16 = emojiIDList.slice(345, 368).join(" ");
    var field17 = emojiIDList.slice(368, 391).join(" ");
    var field18 = emojiIDList.slice(391, 410).join(" ");
    var field19 = emojiIDList.slice(410, 430).join(" ");
    var field20 = emojiIDList.slice(430, 453).join(" ");
    var field21 = emojiIDList.slice(453, 476).join(" ");
    var embed = new Discord.RichEmbed()
    .setTitle("SpookyEmoji List")
    .setColor("#4AB5AA")
    .addField("Emoji Set 15", field15)
    .addField("Emoji Set 16", field16)
    .addField("Emoji Set 17", field17)
    .addField("Emoji Set 18", field18)
    .addField("Emoji Set 19", field19)
    .addField("Emoji Set 20", field20)
    .addField("Emoji Set 21", field21)
    .setFooter("SpookyEmoji List by Ougi [Page 3]", client.user.avatarURL);
    msg.channel.send("These are the emoji I can currently use.\nYou can also browse by page.", {embed});
  }
  else {
    msg.channel.send("Uh, please provide a page number between 1-3.")
  }
}
