module.exports =

async function (arguments, msg) {
  var emojiArray = [];
  var emojiIDList = client.emojis.cache.filter(emoji => emoji.available).map((e) => e.toString()).join("\n");
  var emojiNameList = client.emojis.cache.filter(emoji => emoji.available).map((e) => e.name.toLowerCase()).join("\n");
  for (i=0; i < arguments.length; i++) {
    var searchFor = arguments[i];
    var proArrayID = emojiIDList.split("\n");
    var proArrayName = emojiNameList.split("\n");

    var positionEmoji = proArrayName.indexOf(searchFor);

    if (positionEmoji == -1) {
      var spookyEmoji = "<:unknown_emoji:731996283790950420>"
    }
    else if (arguments[i] == "random") {
      var spookyEmoji = "<a:random:742246590982651976>";
    }
    else {
      var spookyEmoji = proArrayID[positionEmoji];
    }
    emojiArray.push(spookyEmoji)
  }
  if (emojiArray.length >= 1) {
    while (emojiArray.join("").length >= 2000) {
      emojiArray.pop();
    }
    msg.delete().catch(O_o=>{});

    msg.channel.send(emojiArray.join("")).then((message) => {
      if (emojiArray.includes("<a:random:742246590982651976>") && emojiArray.length <= 6) {
        var lucky = client.setInterval(function () {
          let newEmoji = emojiArray.indexOf("<a:random:742246590982651976>");
          let thatEmoji = proArrayID[Math.floor(Math.random()*proArrayID.length)];
          emojiArray.splice(newEmoji, 1, thatEmoji);
          message.edit(emojiArray.join(""));
          if (!emojiArray.includes("<a:random:742246590982651976>")) {
            client.clearInterval(lucky);
          }
        }, 600, message, emojiArray, proArrayID, lucky);
      }
      else if (emojiArray.includes("<a:random:742246590982651976>") && emojiArray.length > 6) {
        let emojiString = emojiArray.join("");
        while (emojiString.includes('<a:random:742246590982651976>')) {
          emojiString = emojiString.replace('<a:random:742246590982651976>', proArrayID[Math.floor(Math.random()*proArrayID.length)])
        }
        message.edit(emojiString);
      }
    }).catch(console.error);
    if (emojiArray.includes("<:unknown_emoji:731996283790950420>")) {
      msg.channel.send(await ougi.text(msg, "seeEmoji") + "\n> ougi emoji-list").catch(console.error);
    }
  }
  else {
    msg.channel.send(await ougi.text(msg, "pleaseIncludeEmoji") + "\n> ougi emoji-list").catch(console.error);
  }
}
