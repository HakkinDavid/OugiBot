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
  let embed = new Discord.MessageEmbed()
  .addField("Users in touch", "`" + members + "` users in total.")
  .addField("Discord servers Ougi's in", "`" + guilds + "` Discord servers in total.")
  .addField("Emoji available for Ougi's usage", "`" + emoji + "` emoji in total.")
  .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
  .addField("\u200b", "Ougi was created by `" + client.users.cache.get("265257341967007758").tag + "`")
  .setColor("#9C0049")
  .setThumbnail(client.users.cache.get("265257341967007758").avatarURL({dynamic: true, size: 256}))
  .setTimestamp()
  .setFooter("statsEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}));
  msg.channel.send(embed)
}
