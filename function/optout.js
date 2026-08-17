module.exports = async function (msg) {
  ougi.db().ignoreUser(msg.author.id);
  const avatar = client.user.displayAvatarURL({ dynamic: true, size: 4096 });
  let embed = new Discord.EmbedBuilder()
    .setTitle(await ougi.text({ msg, stringID: "optout_title" }))
    .setAuthor({ name: "Ougi [BOT]", iconURL: avatar })
    .setColor("#230347")
    .setDescription(await ougi.text({ msg, stringID: "optout_desc" }))
    .addFields({ name: await ougi.text({ msg, stringID: "optout_fieldName" }), value: await ougi.text({ msg, stringID: "optout_fieldValue", values: { phrase: "`I want to start using Ougi [BOT].`" } }) })
    .setFooter({ text: await ougi.text({ msg, stringID: "optout_footer" }), iconURL: avatar })
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true");

  msg.channel.send({ embeds: [embed] }).catch(console.error);
  const devOptoutMsg = await ougi.text({ lang: davidUserID, stringID: "dev_optoutNotice", values: { user: msg.author.username } }).catch(() => `User ${msg.author.username} opted out.`);
  const david = client.users.cache.get(davidUserID) ?? await client.users.fetch(davidUserID).catch(() => null);
  if (david) david.send(devOptoutMsg).catch(() => {});
};
