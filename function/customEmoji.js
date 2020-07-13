module.exports =

function customEmoji(arguments, msg) {
  var emojiArray = [];
  var emojiIDList = client.emojis.filter(emoji => emoji.available).map((e) => e.toString()).join("\n");
  var emojiNameList = client.emojis.filter(emoji => emoji.available).map((e) => e.name.toLowerCase()).join("\n");
  for (i=0; i < arguments.length; i++) {
    var searchFor = arguments[i];
    var proArrayID = emojiIDList.split("\n");
    var proArrayName = emojiNameList.split("\n");

    var positionEmoji = proArrayName.indexOf(searchFor);

    if (positionEmoji == -1) {
      var spookyEmoji = "<:unknown_emoji:731996283790950420>"
    }
    else {
      var spookyEmoji = proArrayID[positionEmoji];
    }
    emojiArray.push(spookyEmoji)
  }
  if (emojiArray.length >= 1) {
    msg.delete().catch(O_o=>{});

    msg.channel.send(emojiArray.join("")).catch(console.error);
    if (emojiArray.includes("<:unknown_emoji:731996283790950420>")) {
      msg.channel.send("I couldn't find one or more of the emoji you asked me for. Execute the following command to see my emoji list:\n> ougi emoji-list").catch(console.error);
    }
  }
  else {
    msg.channel.send("Please provide at least one emoji name. Execute the following command to see my emoji list:\n> ougi emoji-list").catch(console.error);
  }
}
