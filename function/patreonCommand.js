const { EmbedBuilder } = require("discord.js");

module.exports = async function (msg, compact = false) {
  if (compact) {
    const teaseKeys = [
      "patreonTease1",
      "patreonTease2",
      "patreonTease3",
      "patreonTease4",
      "patreonTease5",
      "patreonTease6"
    ];
    const randomKey = teaseKeys[Math.floor(Math.random() * teaseKeys.length)];
    const tinyEmbed = new EmbedBuilder()
      .setTitle((await ougi.text(msg, randomKey)) + " https://patreon.com/HakkinDavid")
      .setFooter({ text: await ougi.text(msg, "patreonFooter") })
      .setColor("#36465D");

    msg.channel.send({ embeds: [tinyEmbed] });
  }

  else {
    const patreonEmbed = new EmbedBuilder()
      .setTitle(await ougi.text(msg, "patreonTitle"))
      .setDescription((await ougi.text(msg, "patreonDescription")) + "\n[" + (await ougi.text(msg, "patreonVisit")) + "](https://patreon.com/HakkinDavid)\nhttps://patreon.com/HakkinDavid")
      .setColor("#0000F0")
      .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/health.png?raw=true")
      .setImage("https://github.com/HakkinDavid/OugiBot/blob/master/images/veryepic.png?raw=true")
      .setFooter({ text: await ougi.text(msg, "patreonFooter") })
      .setTimestamp();

    msg.channel.send({ embeds: [patreonEmbed] });
  }
};