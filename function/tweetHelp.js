module.exports =

async function (msg) {
  var phrases = ["i like fortnite", "foo", "we are no strangers to love"];
  var embed = new Discord.MessageEmbed()
  .setTitle("Ougi's `tweet` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
  .setColor("#230347")
  .setDescription("Use this command to make Ougi create a fake tweet embed, optionally mentioning an user as first argument to set them as author.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField(await ougi.text(msg, "example"), "`ougi tweet `" + msg.author.toString() + "` " + phrases[Math.floor(Math.random()*phrases.length)] + "`");

  msg.channel.send({embed}).catch(console.error);
}
