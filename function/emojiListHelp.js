module.exports =

async function (msg) {
  let number = ["1", "2", "3"];
  let page = number[Math.floor(Math.random()*number.length)];
  let embed = await ougi.helpPreset(msg, "emoji-list");
  embed.setDescription(await ougi.text({ msg, stringID: "emojiListHelpDesc" }))
  .addFields({name: await ougi.text({ msg, stringID: "example" }), value: "`ougi emoji-list " + page + "`"})

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
