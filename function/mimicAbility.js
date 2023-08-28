module.exports =

async function (msg) {
  let reply = await ougi.customEmoji(msg.content.toLowerCase().split(" ").slice(0, 5), null, true);
  while (reply.length > 3) {
    reply.splice(Math.floor(Math.random()*reply.length), 1);
  }
  reply = reply.join(" ");
  let embed = new Discord.EmbedBuilder()
  .setTitle("mimicAbility")
  .setColor("#FF008C")
  .setFooter({text: "globalLogEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .addFields({name: "Replied", value: reply});

  msg.channel.send(reply);
  
  client.channels.cache.get(consoleLogging).send({embeds: [embed]});
}
