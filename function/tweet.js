module.exports = async function (msg) {
  let spookyCake = msg.content.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim();
  let spookySlices = spookyCake.split(" ");
  let args = spookySlices.slice(2);

  let ghostTweet = new Discord.EmbedBuilder()
    .setColor("#00acee")
    .setTimestamp()
    .setFooter({ text: "X", iconURL: "https://github.com/HakkinDavid/OugiBot/blob/master/images/xicon.png?raw=true" });

  if (args.length < 1) {
    msg.channel.send(await ougi.text({ msg, stringID: "tweet_empty" }));
    return;
  }

  if (args[0].startsWith("<@") && args[0].endsWith(">")) {
    let mentionedUserId = args[0].slice(2, -1).replace("!", "");
    let mentionedUser = client.users.cache.get(mentionedUserId) ?? await client.users.fetch(mentionedUserId).catch(() => null);
    if (!mentionedUser) {
      msg.channel.send(await ougi.text({ msg, stringID: "tweet_invalidUser" }));
      return;
    }
    ghostTweet.setAuthor({
      name: `${mentionedUser.username} (@${mentionedUser.username})`,
      iconURL: mentionedUser.displayAvatarURL({ dynamic: true, size: 4096 })
    });
    args.shift();
  } else {
    ghostTweet.setAuthor({
      name: `${msg.author.username} (@${msg.author.username})`,
      iconURL: msg.author.displayAvatarURL({ dynamic: true, size: 4096 })
    });
  }

  ghostTweet.setDescription(args.join(" ").slice(0, 2048));
  if (msg.delete) msg.delete().catch(() => {});
  msg.channel.send({ embeds: [ghostTweet] }).catch(console.error);
};
