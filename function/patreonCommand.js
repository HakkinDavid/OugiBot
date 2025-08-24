const { EmbedBuilder } = require("discord.js");

module.exports = async function (msg) {
  let patreonEmbed = new EmbedBuilder()
    .setTitle("✨ Support Ougi on Patreon! ✨")
    .setDescription(
      "Ougi has been around since 2019, bringing fun, chaos, and entertainment to your servers.\n\n" +
      "If you enjoy using Ougi and want to support its future development, consider becoming a patron. " +
      "Every contribution helps keep the bot alive, growing, and full of surprises.\n\n" +
      "[👉 Visit my Patreon here 👈](https://patreon.com/HakkinDavid)"
    )
    .setColor("#FC7753")
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/news.png?raw=true")
    .setImage("https://i.pinimg.com/736x/bf/5d/ea/bf5dea0e5206220f899e333a8255670c.jpg") // imagen promocional llamativa, cámbiala a la que quieras
    .setFooter({ text: "Thank you for supporting Ougi 💖" })
    .setTimestamp();

  msg.channel.send({ embeds: [patreonEmbed] });
};