module.exports =

async function (msg) {
  let emoji = 0;
  let guilds = 0;
  let members = 0;
  let emojiList = client.emojis.cache.filter(emoji => emoji.available).each((e) => emoji++);
  let guildsList = client.guilds.cache.each((g) => {
    members += g.memberCount-1;
    guilds++;
  });

  const membersField = await ougi.text({ msg, stringID: "stats_membersField" });
  const membersVal = await ougi.text({ msg, stringID: "stats_membersValue", values: { count: members } });
  const guildsField = await ougi.text({ msg, stringID: "stats_guildsField" });
  const guildsVal = await ougi.text({ msg, stringID: "stats_guildsValue", values: { count: guilds } });
  const emojiField = await ougi.text({ msg, stringID: "stats_emojiField" });
  const emojiVal = await ougi.text({ msg, stringID: "stats_emojiValue", values: { count: emoji } });
  const creatorCredit = await ougi.text({ msg, stringID: "stats_creatorCredit", values: { creator: client.users.cache.get(davidUserID).username } });

  let embed = new Discord.EmbedBuilder()
  .addFields({name: membersField, value: membersVal})
  .addFields({name: guildsField, value: guildsVal})
  .addFields({name: emojiField, value: emojiVal})
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .addFields({name: "\u200b", value: creatorCredit})
  .setColor("#9C0049")
  .setThumbnail(client.users.cache.get(davidUserID).avatarURL({dynamic: true, size: 256}))
  .setTimestamp()
  .setFooter({text: await ougi.text({ msg, stringID: "stats_footer" }), icon: client.user.avatarURL({dynamic: true, size: 4096})});
  msg.channel.send({embeds: [embed]})
}
