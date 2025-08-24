module.exports =

  async function (arguments, msg, self) {
    let emojiArray = [];
    let emojiIDList = client.emojis.cache.filter(emoji => emoji.available).map((e) => e.toString()).join("\n");
    let emojiNameList = client.emojis.cache.filter(emoji => emoji.available).map((e) => e.name.toLowerCase()).join("\n");
    let proArrayID = emojiIDList.split("\n");
    let proArrayName = emojiNameList.split("\n");
    for (i = 0; i < arguments.length; i++) {
      let spookyEmoji;

      let positionEmoji = proArrayName.indexOf(arguments[i]);

      if (positionEmoji === -1) {
        positionEmoji = proArrayName.indexOf(stringSimilarity.findBestMatch(arguments[i], proArrayName).bestMatch.target);
      }
      if (arguments[i] === "random") {
        spookyEmoji = "<a:random:742246590982651976>";
      }
      else {
        spookyEmoji = proArrayID[positionEmoji];
      }
      emojiArray.push(spookyEmoji)
    }
    if (self) {
      return emojiArray;
    }
    if (emojiArray.length >= 1) {
      while (emojiArray.join("").length >= 2000) {
        emojiArray.pop();
      }
      msg.delete().catch(O_o => { });

      msg.channel.send(emojiArray.join("")).then((message) => {
        if (emojiArray.includes("<a:random:742246590982651976>") && emojiArray.length <= 6) {
          let lucky = setInterval(function () {
            let newEmoji = emojiArray.indexOf("<a:random:742246590982651976>");
            let thatEmoji = proArrayID[Math.floor(Math.random() * proArrayID.length)];
            emojiArray.splice(newEmoji, 1, thatEmoji);
            message.edit(emojiArray.join(""));
            if (!emojiArray.includes("<a:random:742246590982651976>")) {
              clearInterval(lucky);
            }
          }, 600);
        }
        else if (emojiArray.includes("<a:random:742246590982651976>") && emojiArray.length > 6) {
          let emojiString = emojiArray.join("");
          while (emojiString.includes('<a:random:742246590982651976>')) {
            emojiString = emojiString.replace('<a:random:742246590982651976>', proArrayID[Math.floor(Math.random() * proArrayID.length)])
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
