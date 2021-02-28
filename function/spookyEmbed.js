module.exports =

async function (msg) {
  /*-----------------------------------*/
  while (msg.content.includes('  ')) {
    msg.content = msg.content.replace('  ', ' ')
  }
  while (msg.content.includes('\n\n')) {
    msg.content = msg.content.replace('\n\n', '\n')
  }
  while (msg.content.includes('\n')) {
    msg.content = msg.content.replace('\n', ' ')
  }
  let spookyCake = msg.content;
  let spookySlices = spookyCake.split(" ");
  let spookyCommand = spookySlices[1];
  let arguments = spookySlices.slice(2);
  /*-----------------------------------*/

  let thisMessage = arguments.join(" ");
  let breakChocolate = thisMessage.split("::").slice(1);
  if (breakChocolate.length < 1) {
    msg.channel.send("Please provide at least one argument in order to create an embed. For more information, execute the following command.\n> ougi help embed");
    return
  }
  let fieldsArray = [];
  let fieldsTitles = [];
  let footerArray = [];
  let authorArray = [];
  let presetName = "";
  let sharedWith = [];
  let attachmentsForEmbed = [];
  let listOfPresets = [];

  msg.attachments.map((files) => attachmentsForEmbed.push(files.url));

  if (msg.guild == null) {
    var serverIcon = client.user.avatarURL({dynamic: true, size: 4096});
  }
  else {
    var serverIcon = msg.guild.iconURL();
  }

  let spookyConstructor = new Discord.MessageEmbed();
  for (i=0; breakChocolate.length > i; i++) {
    let material = breakChocolate[i];
    if (material.endsWith(" ")) {
      material = material.slice(0, material.length-1)
    }
    if (material.startsWith("field")) {
      material = material.substring(5);
      if (material.startsWith(" ")) {
        material = material.slice(1)
      }
      if (material.length > 1024) {
        msg.channel.send("Fields must not exceed 1024 characters long.");
        return
      }
      if (material.length < 1) {
        material = "\u200b";
      }
      if (fieldsArray.length == 25) {
        msg.channel.send("Maximum number of fields is 25.");
        return
      }
      fieldsArray.push(material);
    }
    else if (material.startsWith("deletefield ")) {
      material = material.substring(12);
      if (isNaN(material)) {
        msg.channel.send("Please specify an index of field to delete.");
        return
      }
      if (material <= 1) {
        material = 1
      }
      material = material - 1;
      fieldsArray[material] = "/DELETE/";
    }
    else if (material.startsWith("subtitle")) {
      material = material.substring(8);
      if (material.startsWith(" ")) {
        material = material.slice(1)
      }
      if (material.length > 1024) {
        msg.channel.send("Subtitles must not exceed 1024 characters long.");
        return
      }
      if (material.length < 1) {
        material = "\u200b";
      }
      if (fieldsTitles.length == 25) {
        msg.channel.send("Maximum number of subtitles is 25.");
        return
      }
      fieldsTitles.push(material);
    }
    else if (material.startsWith("deletesubtitle ")) {
      material = material.substring(15);
      if (isNaN(material)) {
        msg.channel.send("Please specify an index of subtitle to delete.");
        return
      }
      if (material <= 1) {
        material = 1
      }
      material = material - 1;
      fieldsTitles[material] = undefined;
    }
    else if (material.startsWith("title ")) {
      material = material.substring(6);
      if (material.length < 1 || material.length > 256) {
        msg.channel.send("Title must be between 1 and 256 characters long.");
        return
      }
      spookyConstructor.setTitle(material)
    }
    else if (material.startsWith("save ")) {
      material = material.substring(5);
      if (material.length < 1 || material.length > 100) {
        msg.channel.send("Preset name must be between 1 and 100 characters long.");
        return
      }
      breakChocolate.splice(i, 1);
      presetName = material;
      i--;
    }
    else if (material.startsWith("share ")) {
      material = material.substring(6);
      if (material.startsWith("<@") && material.endsWith(">")) {
        let mentionedUser = material.slice(2, material.length-1).replace("!", "");
        if (!client.users.cache.has(mentionedUser)) {
          msg.channel.send("You must mention an user to share this preset with.");
          return
        }
        sharedWith.push(mentionedUser);
        breakChocolate.splice(i, 1);
        i--;
      }
      else {
        msg.channel.send("You must mention an user to share this preset with.");
        return
      }
    }
    else if (material.startsWith("load ")) {
      material = material.substring(5);
      if (material.length < 1 || material.length > 100) {
        msg.channel.send("Preset name must be between 1 and 100 characters long.");
        return
      }
      let myLoad = JSON.parse(fs.readFileSync("./embedPresets.txt"));
      let aPreset = material + "::" + msg.author.id;
      if (myLoad.hasOwnProperty(aPreset)) {
        let gonnaPull = myLoad[aPreset].reverse();
        breakChocolate.splice(i, 1);
        for (e=0; gonnaPull.length > e; e++) {
          breakChocolate.splice(i, 0, gonnaPull[e]);
        }
        i--
      }
      else {
        msg.channel.send("None of your presets is called `" + material + "`.");
        return
      }
    }
    else if (material.startsWith("list")) {
      let myLoad = JSON.parse(fs.readFileSync("./embedPresets.txt"));
      let aPreset = "::" + msg.author.id;
      let allPresets = Object.keys(myLoad);
      for (e=0; allPresets.length > e; e++) {
        if (allPresets[e].endsWith(aPreset) && !listOfPresets.includes(allPresets[e])) {
          listOfPresets.push(allPresets[e].replace(aPreset, ""));
        }
      }
      if (listOfPresets.length < 1) {
        msg.channel.send("You haven't saved any preset.");
        return
      }
      breakChocolate.splice(i, 1);
      i--;
    }
    else if (material.startsWith("delete ")) {
      material = material.substring(7);
      if (material.length < 1 || material.length > 100) {
        msg.channel.send("Preset name must be between 1 and 100 characters long.");
        return
      }
      let myLoad = JSON.parse(fs.readFileSync("./embedPresets.txt"));
      let aPreset = material + "::" + msg.author.id;
      if (myLoad.hasOwnProperty(aPreset)) {
        breakChocolate.splice(i, 1);
        delete myLoad[aPreset];
        let proArray = JSON.stringify(myLoad);
        let myEmbed = './embedPresets.txt';
        fs.writeFile('./embedPresets.txt', proArray, console.error);

        ougi.backup(myEmbed, embedsChannel);
        msg.channel.send("Deleted preset `" + material + "`.");
        i--;
      }
      else {
        msg.channel.send("None of your presets is called `" + material + "`.");
        return
      }
    }
    else if (material.startsWith("author ")) {
      material = material.substring(7);
      if (material.length < 1 || material.length > 256) {
        msg.channel.send("Author name must be between 1 and 256 characters long.");
        return
      }
      if (material.startsWith("<@") && material.endsWith(">")) {
        let mentionedUser = material.slice(2, material.length-1).replace("!", "");
        if (!client.users.cache.has(mentionedUser)) {
          msg.channel.send("Author name must be either a valid user mention or plain text.");
          return
        }
        authorArray[0] = client.users.cache.get(mentionedUser).username;
      }
      else {
        authorArray[0] = material;
      }
    }
    else if (material.startsWith("authorurl ")) {
      material = material.substring(10);
      if (!material.includes(".")) {
        msg.channel.send("Author URL must be valid. Make sure you add a Top Level Domain (e.g. `.com`, `.net`, `.boo`).").catch(console.error);
        return
      }

      if (material.startsWith("http:")) {
        msg.channel.send("Make sure the provided author URL uses Hyper Text Transfer Protocol Secure (`https`).").catch(console.error);
        return
      }

      if (!material.startsWith("https://")) {
        material = "https://" + material;
      }
      authorArray[2] = material;
    }
    else if (material.startsWith("description ")) {
      material = material.substring(12);
      if (material.length < 1 || material.length > 2048) {
        msg.channel.send("Description must be between 1 and 2048 characters long.");
        return
      }
      spookyConstructor.setDescription(material)
    }
    else if (material.startsWith("desc ")) {
      material = material.substring(5);
      if (material.length < 1 || material.length > 2048) {
        msg.channel.send("Description must be between 1 and 2048 characters long.");
        return
      }
      spookyConstructor.setDescription(material)
    }
    else if (material.startsWith("footer ")) {
      material = material.substring(7);
      if (material.length < 1 || material.length > 2048) {
        msg.channel.send("Footer must be between 1 and 2048 characters long.");
        return
      }
      footerArray[0] = material + " | spookyEmbed by " + msg.author.username;
    }
    else if (material.startsWith("icon ")) {
      material = material.substring(5).replace("guild", serverIcon).replace("ougi", client.user.avatarURL({dynamic: true, size: 4096})).replace("myself", msg.author.avatarURL({dynamic: true, size: 4096}));
      if (material.startsWith("<@") && material.endsWith(">")) {
        let mentionedUser = material.slice(2, material.length-1).replace("!", "");
        if (!client.users.cache.has(mentionedUser)) {
          msg.channel.send("Footer icon must be an attached image, image URL or an user mention. Else, you may specify `guild`, `myself` or `ougi` as icons.");
          return
        }
        footerArray[1] = client.users.cache.get(mentionedUser).avatarURL({dynamic: true, size: 4096});
      }
      else if (material.startsWith("file")) {
        if (attachmentsForEmbed.length < 1) {
          msg.channel.send("You didn't attach any files.");
          return
        }
        material = material.substring(4);
        if (material.startsWith(" ")) {
          material = material.substring(1);
        }
        if (material.length < 1) {
          material = 1;
        }
        if (isNaN(material)) {
          msg.channel.send("Please specify which attached file to use as footer icon (index number) or don't specify any index to use the first one.");
          return
        }
        if (material < 1) {
          material = 1;
        }
        material--;
        if (material > attachmentsForEmbed.length) {
          msg.channel.send("That's not a valid file index (your message had " + attachmentsForEmbed.length + "), you may not specify any index to use the first one.");
          return
        }
        if (!isImageUrl(attachmentsForEmbed[material])) {
          msg.channel.send("Footer icon must be a valid image.");
          return
        }
        footerArray[1] = attachmentsForEmbed[material];
      }
      else {
        if (!isImageUrl(material)) {
          msg.channel.send("Footer icon must be an attached image, image URL or an user mention. Else, you may specify `guild`, `myself` or `ougi` as icons.");
          return
        }
        footerArray[1] = material;
      }
    }
    else if (material.startsWith("avatar ")) {
      material = material.substring(7).replace("guild", serverIcon).replace("ougi", client.user.avatarURL({dynamic: true, size: 4096})).replace("myself", msg.author.avatarURL({dynamic: true, size: 4096}));
      if (material.startsWith("<@") && material.endsWith(">")) {
        let mentionedUser = material.slice(2, material.length-1).replace("!", "");
        if (!client.users.cache.has(mentionedUser)) {
          msg.channel.send("Author avatar must be an attached image, image URL or an user mention. Else, you may specify `guild`, `myself` or `ougi` as avatar.");
          return
        }
        authorArray[1] = client.users.cache.get(mentionedUser).avatarURL({dynamic: true, size: 4096});
      }
      else if (material.startsWith("file")) {
        if (attachmentsForEmbed.length < 1) {
          msg.channel.send("You didn't attach any files.");
          return
        }
        material = material.substring(4);
        if (material.startsWith(" ")) {
          material = material.substring(1);
        }
        if (material.length < 1) {
          material = 1;
        }
        if (isNaN(material)) {
          msg.channel.send("Please specify which attached file to use as author avatar (index number) or don't specify any index to use the first one.");
          return
        }
        if (material < 1) {
          material = 1;
        }
        material--;
        if (material > attachmentsForEmbed.length) {
          msg.channel.send("That's not a valid file index (your message had " + attachmentsForEmbed.length + "), you may not specify any index to use the first one.");
          return
        }
        if (!isImageUrl(attachmentsForEmbed[material])) {
          msg.channel.send("Author avatar must be a valid image.");
          return
        }
        authorArray[1] = attachmentsForEmbed[material];
      }
      else {
        if (!isImageUrl(material)) {
          msg.channel.send("Author avatar must be an attached image, image URL or an user mention. Else, you may specify `guild`, `myself` or `ougi` as avatar.");
          return
        }
        authorArray[1] = material;
      }
    }
    else if (material.startsWith("thumbnail ")) {
      material = material.substring(10).replace("guild", serverIcon).replace("ougi", client.user.avatarURL({dynamic: true, size: 4096})).replace("myself", msg.author.avatarURL({dynamic: true, size: 4096}));
      if (material.startsWith("<@") && material.endsWith(">")) {
        let mentionedUser = material.slice(2, material.length-1).replace("!", "");
        if (!client.users.cache.has(mentionedUser)) {
          msg.channel.send("Thumbnail must be an attached image, image URL or an user mention. Else, you may specify `guild`, `myself` or `ougi` as thumbnail.");
          return
        }
        spookyConstructor.setThumbnail(client.users.cache.get(mentionedUser).avatarURL({dynamic: true, size: 4096}));
      }
      else if (material.startsWith("file")) {
        if (attachmentsForEmbed.length < 1) {
          msg.channel.send("You didn't attach any files.");
          return
        }
        material = material.substring(4);
        if (material.startsWith(" ")) {
          material = material.substring(1);
        }
        if (material.length < 1) {
          material = 1;
        }
        if (isNaN(material)) {
          msg.channel.send("Please specify which attached file to use as thumbnail (index number) or don't specify any index to use the first one.");
          return
        }
        if (material < 1) {
          material = 1;
        }
        material--;
        if (material > attachmentsForEmbed.length) {
          msg.channel.send("That's not a valid file index (your message had " + attachmentsForEmbed.length + "), you may not specify any index to use the first one.");
          return
        }
        if (!isImageUrl(attachmentsForEmbed[material])) {
          msg.channel.send("Thumbnail must be a valid image.");
          return
        }
        spookyConstructor.setThumbnail(attachmentsForEmbed[material]);
      }
      else {
        if (!isImageUrl(material)) {
          msg.channel.send("Thumbnail must be an attached image, image URL or an user mention. Else, you may specify `guild`, `myself` or `ougi` as thumbnail.");
          return
        }
        spookyConstructor.setThumbnail(material);
      }
    }
    else if (material.startsWith("image ")) {
      material = material.substring(6).replace("guild", serverIcon).replace("ougi", client.user.avatarURL({dynamic: true, size: 4096})).replace("myself", msg.author.avatarURL({dynamic: true, size: 4096}));
      if (material.startsWith("<@") && material.endsWith(">")) {
        let mentionedUser = material.slice(2, material.length-1).replace("!", "");
        if (!client.users.cache.has(mentionedUser)) {
          msg.channel.send("Image must be an attached image, image URL or an user mention. Else, you may specify `guild`, `myself` or `ougi` as image.");
          return
        }
        spookyConstructor.setImage(client.users.cache.get(mentionedUser).avatarURL({dynamic: true, size: 4096}));
      }
      else if (material.startsWith("file")) {
        if (attachmentsForEmbed.length < 1) {
          msg.channel.send("You didn't attach any files.");
          return
        }
        material = material.substring(4);
        if (material.startsWith(" ")) {
          material = material.substring(1);
        }
        if (material.length < 1) {
          material = 1;
        }
        if (isNaN(material)) {
          msg.channel.send("Please specify which attached file to use as image (index number) or don't specify any index to use the first one.");
          return
        }
        if (material < 1) {
          material = 1;
        }
        material--;
        if (material > attachmentsForEmbed.length) {
          msg.channel.send("That's not a valid file index (your message had " + attachmentsForEmbed.length + "), you may not specify any index to use the first one.");
          return
        }
        if (!isImageUrl(attachmentsForEmbed[material])) {
          msg.channel.send("Specified file must be a valid image.");
          return
        }
        spookyConstructor.setImage(attachmentsForEmbed[material]);
      }
      else {
        if (!isImageUrl(material)) {
          msg.channel.send("Image must be an attached image, image URL or an user mention. Else, you may specify `guild`, `myself` or `ougi` as image.");
          return
        }
        spookyConstructor.setImage(material);
      }
    }
    else if (material.startsWith("url ")) {
      material = material.substring(4);
      if (!material.includes(".")) {
        msg.channel.send("That doesn't look like an URL. Make sure you add a Top Level Domain (e.g. `.com`, `.net`, `.boo`).").catch(console.error);
        return
      }
      if (material.startsWith("http:")) {
        msg.channel.send("Make sure the provided URL uses Hyper Text Transfer Protocol Secure (`https`).").catch(console.error);
        return
      }

      if (!material.startsWith("https://")) {
        material = "https://" + material;
      }
      spookyConstructor.setURL(material)
    }
    else if (material.startsWith("timestamp")) {
      spookyConstructor.setTimestamp();
    }
    else if (material.startsWith("color ")) {
      let pseudoColor = "";
      material = material.substring(6);
      if (!material.startsWith("#")) {
        pseudoColor = "#" + material;
      }
      else {
        pseudoColor = material;
      }
      if (isHexcolor(pseudoColor)) {
        spookyConstructor.setColor(pseudoColor);
      }
      else {
        while (material.includes(" ")) {
          material = material.replace(" ", ",");
        }
        while (material.includes(",,")) {
          material = material.replace(",,", ",");
        }
        let rgbArray = material.split(",");
        if (rgbArray.length <= 3 && !isNaN(rgbArray[0]) && !isNaN(rgbArray[1]) && !isNaN(rgbArray[2])) {
          if (rgbArray[0] > 255 || rgbArray[1] > 255 || rgbArray[2] > 255) {
            msg.channel.send("Please provide a valid hexadecimal color, RGB color (separated by commas) or a supported color name. You may specify `random` to get a random color.");
            return
          }
          spookyConstructor.setColor(material);
        }
        else {
          material = material.toUpperCase().replace("YELLOW", "GOLD");
          while (material.includes(",")) {
            material = material.replace(",", "_");
          }
          let coolColors = ["DEFAULT","WHITE","AQUA","GREEN","BLUE","PURPLE","LUMINOUS_VIVID_PINK","GOLD","ORANGE","RED","GREY","DARKER_GREY","NAVY","DARK_AQUA","DARK_GREEN","DARK_BLUE","DARK_PURPLE","DARK_VIVID_PINK","DARK_GOLD","DARK_ORANGE","DARK_RED","DARK_GREY","LIGHT_GREY","DARK_NAVY","BLACK","RANDOM"];
          if(coolColors.includes(material)) {
            spookyConstructor.setColor(material);
          }
          else {
            msg.channel.send("Please provide a valid hexadecimal color, RGB color (separated by commas) or a supported color name. You may specify `random` to get a random color.");
            return
          }
        }
      }
    }
    else {
      msg.channel.send("Perhaps you're doing it wrong. Refer to the following command for usage information.\n> ougi help embed");
      return
    }
  }
  if (footerArray[0] != undefined && footerArray[1] == undefined) {
    spookyConstructor.setFooter(footerArray[0])
  }
  else if (footerArray[0] == undefined && footerArray[1] != undefined) {
    spookyConstructor.setFooter("\u200b", footerArray[1])
  }
  else if (footerArray[0] != undefined && footerArray[1] != undefined) {
    spookyConstructor.setFooter(footerArray[0], footerArray[1])
  }

  if (authorArray[0] != undefined && authorArray[1] == undefined && authorArray[2] == undefined) {
    spookyConstructor.setAuthor(authorArray[0])
  }
  else if (authorArray[0] == undefined && authorArray[1] != undefined && authorArray[2] == undefined) {
    spookyConstructor.setAuthor("\u200b", authorArray[1])
  }
  else if (authorArray[0] != undefined && authorArray[1] != undefined && authorArray[2] == undefined) {
    spookyConstructor.setAuthor(authorArray[0], authorArray[1])
  }
  else if (authorArray[0] != undefined && authorArray[1] == undefined && authorArray[2] != undefined) {
    spookyConstructor.setAuthor(authorArray[0], undefined, authorArray[2])
  }
  else if (authorArray[0] == undefined && authorArray[1] != undefined && authorArray[2] != undefined) {
    spookyConstructor.setAuthor("\u200b", authorArray[1], authorArray[2])
  }
  else if (authorArray[0] != undefined && authorArray[1] != undefined && authorArray[2] != undefined) {
    spookyConstructor.setAuthor(authorArray[0], authorArray[1], authorArray[2])
  }

  for (i=0; fieldsArray.length > i || fieldsTitles.length > i; i++) {
    if (fieldsArray[i] == "/DELETE/" && fieldsTitles[i] != "/DELETE/") {
      fieldsArray.splice(i, 1)
      i--;
    }
    else if (fieldsTitles[i] == "/DELETE/" && fieldsArray[i] != "/DELETE/") {
      fieldsTitles.splice(i, 1)
      i--;
    }
    else if (fieldsTitles[i] == "/DELETE/" && fieldsArray[i] == "/DELETE/") {
      fieldsArray.splice(i, 1)
      fieldsTitles.splice(i, 1)
      i--;
    }
  }

  for (i=0; fieldsArray.length > i || fieldsTitles.length > i; i++) {
    if (fieldsArray[i] != undefined && fieldsTitles[i] != undefined) {
      spookyConstructor.addField(fieldsTitles[i], fieldsArray[i])
    }
    else if (fieldsArray[i] == undefined && fieldsTitles[i] != undefined) {
      spookyConstructor.addField(fieldsTitles[i], "\u200b")
    }
    else if (fieldsArray[i] != undefined && fieldsTitles[i] == undefined) {
      spookyConstructor.addField("\u200b", fieldsArray[i])
    }
  }

  if (breakChocolate.length >= 1) {
    msg.channel.send(spookyConstructor).then(
      setTimeout(
        function () {
          msg.delete().catch(O_o=>{})
        }, 2000, msg
      )
    );
  }

  if (presetName.length >= 1) {
    if (breakChocolate.length < 1) {
      msg.channel.send("Your embed must not be empty.");
      return
    }
    let pseudoArray = JSON.parse(fs.readFileSync('./embedPresets.txt', 'utf-8', console.error));
    let personalizedPresetName = presetName + "::" + msg.author.id;

    pseudoArray[personalizedPresetName] = breakChocolate;
    let proArray = JSON.stringify(pseudoArray);
    let myEmbed = './embedPresets.txt';
    fs.writeFile('./embedPresets.txt', proArray, console.error);

    ougi.backup(myEmbed, embedsChannel);
    msg.channel.send("Saved preset as `" + presetName + "`, it's now available for you to use as template. Include `::load " + presetName + "` as command option whenever you want to use it.");
  }

  if (sharedWith.length >= 1) {
    if (breakChocolate.length < 1) {
      msg.channel.send("Your embed must not be empty.");
      return
    }
    let pseudoArray = JSON.parse(fs.readFileSync('./embedPresets.txt', 'utf-8', console.error));
    let circleOfSharing = [];
    for (i=0; i < sharedWith.length; i++) {
      circleOfSharing.push(client.users.cache.get(sharedWith[i]).username);
      let everyPresetShare = msg.author.username + "'s preset::" + sharedWith[i];
      pseudoArray[everyPresetShare] = breakChocolate;
    }

    let proArray = JSON.stringify(pseudoArray);

    let myEmbed = './embedPresets.txt';
    fs.writeFile('./embedPresets.txt', proArray, console.error);

    ougi.backup(myEmbed, embedsChannel);
    msg.channel.send("Shared preset as `" + msg.author.username + "'s preset` with `" + circleOfSharing.join("`, `") + "`. It's now available for them to use as template until it's overwritten by another share of yours. In order to keep it, they must load and save it under another name. Tell them to include `::load " + msg.author.username + "'s preset` as command option whenever they want to use it.");
  }
  if (listOfPresets.length >= 1) {
    msg.channel.send("List of " + msg.author.username + "'s embed presets:\n`" + listOfPresets.join("`, `") + "`");
  }
}
