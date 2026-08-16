module.exports =

async function (arguments, msg) {
  var optionKeys = ["undefined_resp1", "undefined_resp2", "undefined_resp3", "undefined_resp4", "undefined_resp5", "undefined_resp6"];
  var randomKey = optionKeys[Math.floor(Math.random()*optionKeys.length)];
  var response = await ougi.text(msg, randomKey);
  msg.channel.send(response).catch(console.error);
  var embed = new Discord.EmbedBuilder()
  .setTitle(await ougi.text(msg, "undefined_repliedTitle"))
  .setDescription(response)
  .setColor("#FF008C")
  .setFooter({text: await ougi.text(msg, "undefined_footer"), icon: client.user.avatarURL({dynamic: true, size: 4096})})
  client.channels.cache.get(consoleLogging).send({embeds: [embed]});
  return
}
