module.exports =

async function (msg) {
  let reply = await ougi.customEmoji(msg.content.toLowerCase().split(" ").slice(0, 5), null, true);
  while (reply.length > 3) {
    reply.splice(Math.floor(Math.random()*reply.length), 1);
  }
  reply = reply.join(" ");
  let embed = new Discord.MessageEmbed()
  .setTitle("mimicAbility")
  .setColor("#FF008C")
  .setFooter("globalLogEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
  .addField("Replied", reply);

  msg.channel.send(reply);
  
  client.channels.cache.get(consoleLogging).send(embed);
}
