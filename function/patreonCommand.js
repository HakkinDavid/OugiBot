const { EmbedBuilder } = require("discord.js");

module.exports = async function (msg) {

  const patreonEmbed = new EmbedBuilder()
    .setTitle(await ougi.text(msg, "patreonTitle"))
    .setDescription(await ougi.text(msg, "patreonDescription"))
    .setColor("#0000F0")
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/health.png?raw=true")
    .setImage("https://github.com/HakkinDavid/OugiBot/blob/master/images/veryepic.png?raw=true")
    .setFooter({ text: await ougi.text(msg, "patreonFooter") })
    .setTimestamp();

  msg.channel.send({ embeds: [patreonEmbed] });
};