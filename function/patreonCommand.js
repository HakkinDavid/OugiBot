const { EmbedBuilder } = require("discord.js");

module.exports = async function (msg, ougi) {
  const title = await ougi.text(msg, "patreonTitle");
  const description = await ougi.text(msg, "patreonDescription");
  const footer = await ougi.text(msg, "patreonFooter");

  const patreonEmbed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor("#000F0")
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/health.png?raw=true")
    .setImage("https://github.com/HakkinDavid/OugiBot/blob/master/images/veryepic.png?raw=true")
    .setFooter({ text: footer })
    .setTimestamp();

  msg.channel.send({ embeds: [patreonEmbed] });
};