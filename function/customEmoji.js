module.exports =

function customEmoji(arguments, msg) {
  var searchFor = arguments[0];

  var emojiIDList = client.emojis.filter(emoji => emoji.available).map((e) => e.toString()).join("\n");
  var emojiNameList = client.emojis.filter(emoji => emoji.available).map((e) => e.name.toLowerCase()).join("\n");
  var proArrayID = emojiIDList.split("\n");
  var proArrayName = emojiNameList.split("\n");

  var positionEmoji = proArrayName.indexOf(searchFor);

  if (positionEmoji == -1) {
    msg.channel.send("That's not a name for any emoji I have access to. Run the following command to see the nice emojis I can use:\n> ougi emoji-list");
    return
  }

  var spookyEmoji = proArrayID[positionEmoji];

  msg.delete().catch(O_o=>{});

  msg.channel.send(spookyEmoji).catch(console.error);
}
