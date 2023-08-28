module.exports =

async function (msg) {
  let availableAdvices = 30;
  let adviceNum = Math.floor(Math.random()*availableAdvices);
  let healthyAdvice = await ougi.text(msg, "hca" + adviceNum);
  let embed = new Discord.EmbedBuilder()
  .setTitle(await ougi.text(msg, "adviceTitle") + " #" + adviceNum)
  .setDescription(healthyAdvice)
  .addFields({name: "\u200b", value: "[" + await ougi.text(msg, "WHOCOVID19ADVICE") + "](https://www.who.int/emergencies/diseases/novel-coronavirus-2019)"})
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/health.png?raw=true")
  .setColor(["#03FC66", "#03FCBA", "#F0466D", "#FA7FE5", "#7F8CFA"][Math.floor(Math.random()*5)])
  .setFooter({text: "Advice provided by WHO, healthyAdviceEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setTimestamp();
  msg.channel.send({embeds: [embed]});
}
