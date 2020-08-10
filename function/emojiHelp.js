module.exports =

function (msg) {
  var emojiIDList = client.emojis.cache.filter(emoji => emoji.available).map((e) => e.toString()).join("\n");
  var emojiNameList = client.emojis.cache.filter(emoji => emoji.available).map((e) => e.name.toLowerCase()).join("\n");
  var proArrayID = emojiIDList.split("\n");
  var proArrayName = emojiNameList.split("\n");

  var searchFor = proArrayName[Math.floor(Math.random()*proArrayName.length)];
  var thatEmoji = proArrayName.indexOf(searchFor)
  var spookyEmoji = proArrayID[thatEmoji];
  var searchFor2 = proArrayName[Math.floor(Math.random()*proArrayName.length)];
  var thatEmoji2 = proArrayName.indexOf(searchFor2)
  var spookyEmoji2 = proArrayID[thatEmoji2];
  var searchFor3 = proArrayName[Math.floor(Math.random()*proArrayName.length)];
  var thatEmoji3 = proArrayName.indexOf(searchFor3)
  var spookyEmoji3 = proArrayID[thatEmoji3];
  var embed = new Discord.MessageEmbed()
  .setTitle("Ougi's `emoji` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setDescription("Use this command to make Ougi send an emoji based on the provided emoji name. You can ask for more than one! You may also include `random` as emoji name to chose a random emoji from the list.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi emoji " + searchFor + " " + searchFor2 + " " + searchFor3 + "`")
  .addField("Output", spookyEmoji + spookyEmoji2 + spookyEmoji3)
  .addField("Take a look at the emoji list!", "`ougi emoji-list`")

  msg.channel.send({embed}).catch(console.error);
}
