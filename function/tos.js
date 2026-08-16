module.exports =

async function (msg) {
  const creator = client.users.cache.get(davidUserID).username;

  var embed = new Discord.EmbedBuilder()
  .setTitle(await ougi.text({ msg, stringID: "tos_title" }))
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setColor("#230347")
  .setDescription(await ougi.text({ msg, stringID: "tos_desc" }))
  .setFooter({text: await ougi.text({ msg, stringID: "tos_footer" }), icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .addFields({name: await ougi.text({ msg, stringID: "tos_contactField" }), value: await ougi.text({ msg, stringID: "tos_contactValue", values: { creator } })})
  .addFields({name: await ougi.text({ msg, stringID: "tos_loggingField" }), value: await ougi.text({ msg, stringID: "tos_loggingValue" })})
  .addFields({name: await ougi.text({ msg, stringID: "tos_nlpField" }), value: await ougi.text({ msg, stringID: "tos_nlpValue" })})
  .addFields({name: await ougi.text({ msg, stringID: "tos_snipeField" }), value: await ougi.text({ msg, stringID: "tos_snipeValue" })})
  .addFields({name: await ougi.text({ msg, stringID: "tos_optoutField" }), value: await ougi.text({ msg, stringID: "tos_optoutValue", values: { bot: client.user.toString() } })})
  .addFields({name: await ougi.text({ msg, stringID: "tos_onceOptoutField" }), value: await ougi.text({ msg, stringID: "tos_onceOptoutValue" })})
  .addFields({name: await ougi.text({ msg, stringID: "tos_detailedPolicyField" }), value: "https://github.com/HakkinDavid/OugiBot/blob/1e510275c395a691181e8ec18fcb39263d7cc2db/docs/Ougi%20BOT%20Privacy%20Policy.pdf"});
  msg.channel.send({embeds: [embed]}).catch(console.error);
}
