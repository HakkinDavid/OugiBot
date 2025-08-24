const { EmbedBuilder } = require("discord.js");

module.exports = async function (msg, ougi) {
  const title = await ougi.text(msg, "patreon_title");
  const description = await ougi.text(msg, "patreon_description");
  const footer = await ougi.text(msg, "patreon_footer");

  const patreonEmbed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor("#FC7753")
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/news.png?raw=true")
    .setImage("https://i.pinimg.com/736x/bf/5d/ea/bf5dea0e5206220f899e333a8255670c.jpg")
    .setFooter({ text: footer })
    .setTimestamp();

  msg.channel.send({ embeds: [patreonEmbed] });
};