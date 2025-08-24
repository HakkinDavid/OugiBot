module.exports =

async function (msg) {
  let emojiIDList = client.emojis.cache.filter(emoji => emoji.available).map((e) => e.toString()).join("\n");
  let emojiNameList = client.emojis.cache.filter(emoji => emoji.available).map((e) => e.name.toLowerCase()).join("\n");
  let proArrayID = emojiIDList.split("\n");
  let proArrayName = emojiNameList.split("\n");

  let searchFor = proArrayName[Math.floor(Math.random()*proArrayName.length)];
  let thatEmoji = proArrayName.indexOf(searchFor)
  let spookyEmoji = proArrayID[thatEmoji];
  let searchFor2 = proArrayName[Math.floor(Math.random()*proArrayName.length)];
  let thatEmoji2 = proArrayName.indexOf(searchFor2)
  let spookyEmoji2 = proArrayID[thatEmoji2];
  let searchFor3 = proArrayName[Math.floor(Math.random()*proArrayName.length)];
  let thatEmoji3 = proArrayName.indexOf(searchFor3)
  let spookyEmoji3 = proArrayID[thatEmoji3];
  let embed = await ougi.helpPreset(msg, "emoji");
  embed.setDescription((await ougi.text(msg, "emojiHelpDesc")).replace(/{commandOption}/gi, "`random`"))
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi emoji " + searchFor + " " + searchFor2 + " " + searchFor3 + "`"})
  .addFields({name: await ougi.text(msg, "output"), value: spookyEmoji + spookyEmoji2 + spookyEmoji3})
  .addFields({name: await ougi.text(msg, "lookEmoji"), value: "`ougi emoji-list`"})

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
