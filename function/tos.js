module.exports =

async function (msg) {
  const creator = client.users.cache.get(davidUserID).username;
  const contactValTemplate = await ougi.text(msg, "tos_contactValue");
  const optoutValTemplate = await ougi.text(msg, "tos_optoutValue");

  var embed = new Discord.EmbedBuilder()
  .setTitle(await ougi.text(msg, "tos_title"))
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setDescription(await ougi.text(msg, "tos_desc"))
  .setFooter({text: await ougi.text(msg, "tos_footer"), icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .addFields({name: await ougi.text(msg, "tos_contactField"), value: contactValTemplate.replace(/{creator}/g, creator)})
  .addFields({name: await ougi.text(msg, "tos_loggingField"), value: await ougi.text(msg, "tos_loggingValue")})
  .addFields({name: await ougi.text(msg, "tos_nlpField"), value: await ougi.text(msg, "tos_nlpValue")})
  .addFields({name: await ougi.text(msg, "tos_snipeField"), value: await ougi.text(msg, "tos_snipeValue")})
  .addFields({name: await ougi.text(msg, "tos_optoutField"), value: optoutValTemplate.replace(/{bot}/g, client.user.toString())})
  .addFields({name: await ougi.text(msg, "tos_onceOptoutField"), value: await ougi.text(msg, "tos_onceOptoutValue")})
  .addFields({name: await ougi.text(msg, "tos_detailedPolicyField"), value: "https://github.com/HakkinDavid/OugiBot/blob/1e510275c395a691181e8ec18fcb39263d7cc2db/docs/Ougi%20BOT%20Privacy%20Policy.pdf"});
  msg.channel.send({embeds: [embed]}).catch(console.error);
}
