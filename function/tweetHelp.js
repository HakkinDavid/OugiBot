module.exports =

async function (msg) {
  var phrases = ["i like fortnite", "foo", "we are no strangers to love"];
  var embed = new Discord.EmbedBuilder()
  .setTitle("Ougi's `tweet` command")
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setDescription("Use this command to make Ougi create a fake tweet embed, optionally mentioning an user as first argument to set them as author.")
  .setFooter({text: "helpEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi tweet `" + msg.author.toString() + "` " + phrases[Math.floor(Math.random()*phrases.length)] + "`"});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
