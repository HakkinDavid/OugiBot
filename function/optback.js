module.exports =

async function (msg) {
  ougi.db().unignoreUser(msg.author.id);
  let embed = new Discord.EmbedBuilder()
  .setTitle(await ougi.text(msg, "optin_title"))
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setDescription(await ougi.text(msg, "optin_desc"))
  .setFooter({text: await ougi.text(msg, "optout_footer"), icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  msg.channel.send({embeds: [embed]});
}
