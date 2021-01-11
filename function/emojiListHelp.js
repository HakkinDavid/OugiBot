module.exports =

async function (msg) {
  let number = ["1", "2", "3"];
  let page = number[Math.floor(Math.random()*number.length)];
  let embed = await ougi.helpPreset(msg, "emoji-list");
  embed.setDescription(await ougi.text(msg, "emojiListHelpDesc"))
  .addField(await ougi.text(msg, "example"), "`ougi emoji-list " + page + "`")

  msg.channel.send({embed}).catch(console.error);
}
