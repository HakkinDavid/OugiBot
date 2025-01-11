module.exports =

async function (arguments, msg) {
    if (arguments.length < 1) {
      msg.channel.send(await ougi.text(msg, "keywordRequired")).catch(console.error);
      return;
    }

    let imageToSend = "https://image.pollinations.ai/prompt/" + encodeURIComponent(arguments.join(" ")) + "?width=1920&height=1080&nologo=true&private=true&safe=" + (msg.channel.nsfw ? "false" : "true") + "&seed=" + 100 * Math.random() + 1;

    let foreshadow = await msg.channel.send((await ougi.text(msg, "awaitGenImg")).replace(/{userName}/, msg.author.username));

    try {
      const response = await fetch(imageToSend);
      const imageAttachment = new Discord.AttachmentBuilder(response.body, { name: "ougi-generated-image.png" });
      let spookyImage = new Discord.EmbedBuilder()
          .setTitle(await ougi.text(msg, "genImg"))
          .setDescription(arguments.join(" "))
          .setImage("attachment://ougi-generated-image.png")
          .setFooter({text: "imageEmbed by Ougi, prompt by " + msg.author.username, icon: client.user.avatarURL({dynamic: true, size: 4096})})
          .setTimestamp()
          .setColor("#230347");
      msg.channel.send({embeds: [spookyImage], files: [imageAttachment]}).catch(console.error);
      foreshadow.delete();
    }
    catch (e) {
      console.error(e);
      foreshadow.edit(await ougi.text(msg, "unableGenImg"));
    }
}
