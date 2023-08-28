module.exports =

async function (arguments, msg) {
  let emojiIDList = await client.emojis.cache.filter(emoji => emoji.available).map((e) => e.toString()).reverse();
  let emojiNameList = await client.emojis.cache.filter(emoji => emoji.available).map((e) => e.name).reverse();
  let howMany = emojiIDList.length;
  let pageMax = Math.ceil(howMany / 14);
  let page = arguments * 1 - 1;

  if (isNaN(page)) {
    msg.channel.send(await ougi.text(msg, "pleasePage")).catch(console.error);
    return
  }

  if (page <= 0) {
    page = 0
  }

  let displayPage = page + 1;
  if (displayPage > pageMax) {
    msg.channel.send(await ougi.text(msg, "notPage")).catch(console.error);
    return
  }

  let newList = ougi.miniArrays(emojiIDList, 14);
  let newNameList = ougi.miniArrays(emojiNameList, 14);
  let willShow = newList[page];
  let willShowN = newNameList[page];
  let embed = new Discord.EmbedBuilder()
    .setTitle("spookyEmoji List | Page " + displayPage)
    .setColor("#C93A57")
    .setFooter({text: (await ougi.text(msg, "emojiListFooter")).replace(/{emoji}/gi, howMany).replace(/{numpage}/gi, pageMax), icon: client.user.avatarURL({dynamic: true, size: 4096})});
    for (i = 0; i < willShow.length; i+=2) {
      if (willShow[i+1] == undefined) {
        willShow[i+1] = "\u200b";
        willShowN[i+1] = "\u200b";
      }
      embed.addFields({name: willShow[i] + " `" + willShowN[i] + "`", value: willShow[i+1] + " `" + willShowN[i+1] + "`"})
    };

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
