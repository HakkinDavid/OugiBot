module.exports =

async function (msg) {
  ougi.db().unignoreUser(msg.author.id);
  let embed = new Discord.EmbedBuilder()
  .setTitle("Opt In to Ougi")
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setDescription("You've successfully opted in to use Ougi and its services.")
  .setFooter({text: "optoutEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  msg.channel.send({embeds: [embed]});
}
