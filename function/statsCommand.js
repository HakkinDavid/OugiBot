module.exports =

function (msg) {
  let emoji = 0;
  let guilds = 0;
  let members = 0;
  let emojiList = client.emojis.cache.filter(emoji => emoji.available).each((e) => emoji++);
  let guildsList = client.guilds.cache.each((g) => {
    members += g.memberCount-1;
    guilds++;
  });
  let embed = new Discord.EmbedBuilder()
  .addFields({name: "Users in touch", value: "`" + members + "` users in total."})
  .addFields({name: "Discord servers Ougi's in", value: "`" + guilds + "` Discord servers in total."})
  .addFields({name: "Emoji available for Ougi's usage", value: "`" + emoji + "` emoji in total."})
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .addFields({name: "\u200b", value: "Ougi was created by `" + client.users.cache.get(davidUserID).username + "`"})
  .setColor("#9C0049")
  .setThumbnail(client.users.cache.get(davidUserID).avatarURL({dynamic: true, size: 256}))
  .setTimestamp()
  .setFooter({text: "statsEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})});
  msg.channel.send({embeds: [embed]})
}
