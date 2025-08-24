const { EmbedBuilder } = require("discord.js");

module.exports = async function (msg, compact = false) {

  if (compact) {
    msg.channel.send((await ougi.text(msg, "patreonTitleCompact")) + "\n" + (await ougi.text(msg, "patreonDescriptionCompact")) + "\n[" + (await ougi.text(msg, "patreonVisitCompact")) + "](https://patreon.com/HakkinDavid)\nhttps://patreon.com/HakkinDavid" + "\n" + (await ougi.text(msg, "patreonFooterCompact")));
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