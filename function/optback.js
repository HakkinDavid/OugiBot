module.exports = async function (msg) {
  ougi.db().unignoreUser(msg.author.id);
  const avatar = client.user.displayAvatarURL({ dynamic: true, size: 4096 });
  let embed = new Discord.EmbedBuilder()
    .setTitle(await ougi.text({ msg, stringID: "optin_title" }))
    .setAuthor({ name: "Ougi [BOT]", iconURL: avatar })
    .setColor("#230347")
    .setDescription(await ougi.text({ msg, stringID: "optin_desc" }))
    .setFooter({ text: await ougi.text({ msg, stringID: "optout_footer" }), iconURL: avatar })
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true");

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
