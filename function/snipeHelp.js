module.exports =

function (msg) {
  var phrases = ["i love dogs", "where are you bb?", "is this sending?"];
  var sniped = phrases[Math.floor(Math.random()*phrases.length)];
  var phrasesTwo = ["i love cats", "don't flirt with me, you- baka", "i hate cheese"];
  var snipedTwice = phrasesTwo[Math.floor(Math.random()*phrasesTwo.length)];
  var embed = new Discord.RichEmbed()
  .setTitle("Ougi's `snipe` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL)
  .setColor("#230347")
  .setDescription("Use this command to make Ougi show any recently deleted messages in this channel. You may browse the deleted messages by specifying a number (starting in 1 for the last deletion).")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi snipe`")
  .addField("Output", "<:ougi:730355760864952401> **Ougi said** <:quote:730061725755375667> " + sniped)
  .addField("Example 2", "`ougi snipe 3`")
  .addField("Output", "<:ougi:730355760864952401> **Ougi said** <:quote:730061725755375667> " + snipedTwice)

  msg.channel.send({embed}).catch(console.error);
}
