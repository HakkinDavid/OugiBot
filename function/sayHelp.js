module.exports =

async function (msg) {
  var phrases = ["sike", "boo", "never gonna give you up"];
  var say = phrases[Math.floor(Math.random()*phrases.length)];
  var embed = new Discord.EmbedBuilder()
  .setTitle("Ougi's `say` command")
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setDescription("Use this command to make Ougi send a message based on your words.")
  .setFooter({text: "helpEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi say " + say + "`"})
  .addFields({name: await ougi.text(msg, "output"), value: say})

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
