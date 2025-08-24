const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = async function imageCommand(arguments, msg) {
  if (!arguments || arguments.length < 1) {
    await msg.channel.send(await ougi.text(msg, "keywordRequired")).catch(console.error);
    return;
  }

  const prompt = arguments.join(" ");
  const imageToSend = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1920&height=1080&nologo=true&private=true&safe=${msg.channel.nsfw ? "false" : "true"}&seed=${100 * Math.random() + 1}`;

  const foreshadow = await msg.channel.send((await ougi.text(msg, "awaitGenImg")).replace(/{userName}/, msg.author.username));

  try {
    const response = await fetch(imageToSend);
    if (!response.ok) throw new Error(`Error fetching image: ${response.statusText}`);

    const imageBuffer = await response.buffer();
    const imageAttachment = new AttachmentBuilder(imageBuffer, { name: "ougi-generated-image.png" });

    const spookyImage = new EmbedBuilder()
      .setTitle(await ougi.text(msg, "genImg"))
      .setDescription(prompt)
      .setImage("attachment://ougi-generated-image.png")
      .setFooter({
        text: `imageEmbed by Ougi, prompt by ${msg.author.username}`,
        iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 })
      })
      .setTimestamp()
      .setColor("#230347");

    await msg.channel.send({ embeds: [spookyImage], files: [imageAttachment] });
    await foreshadow.delete();
  } catch (e) {
    console.error(e);
    await foreshadow.edit(await ougi.text(msg, "unableGenImg"));
  }
};
