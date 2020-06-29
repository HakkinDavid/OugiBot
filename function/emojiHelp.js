module.exports =

function emojiHelp(msg) {
  var emoji = ["reverse", "nou", "dorime"];
  var searchFor = emoji[Math.floor(Math.random()*emoji.length)];;

  var emojiIDList = client.emojis.filter(emoji => emoji.available).map((e) => e.toString()).join("\n");
  var emojiNameList = client.emojis.filter(emoji => emoji.available).map((e) => e.name.toLowerCase()).join("\n");
  var proArrayID = emojiIDList.split("\n");
  var proArrayName = emojiNameList.split("\n");

  var positionEmoji = proArrayName.indexOf(searchFor);
  var spookyEmoji = proArrayID[positionEmoji];
  var phrases = ["<:dorime:726944323660152892>", "<:nou:726944701348970496>", "<:reverse:726944329754476614>"];
  var say = phrases[Math.floor(Math.random()*phrases.length)];
  var embed = new Discord.RichEmbed()
  .setTitle("Ougi's `emoji` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL)
  .setColor("#230347")
  .setDescription("Use this command to make Ougi send an emoji.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi emoji " + searchFor + "`")
  .addField("Output", spookyEmoji)
  .addField("Emoji list", "Use `ougi emoji-list`")

  msg.channel.send({embed}).catch(console.error);
}
