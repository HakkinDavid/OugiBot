module.exports =

async function (msg, stringID) {
  let langSettings = settingsOBJ.lang;
  let langCode = "en";
  if (langSettings.hasOwnProperty(msg.author.id)) {
    langCode = langSettings[msg.author.id]
  }
  if (msg.channel.type == "text") {
    if (langSettings.hasOwnProperty(msg.guild.id)) {
      langCode = langSettings[msg.guild.id];
    }
  }
  if (ougi.localization[stringID] == undefined) {
    return "[Sorry, this text field hasn't been declared]";
  }
  let returnableString = ougi.localization[stringID][langCode];
  if (returnableString == undefined && ougi.localization[stringID].en != undefined) {
    switch (langCode) {
      case "mx":
        langCode = "es";
      break;
    }
    if (localesCache[stringID] == undefined) {
      localesCache[stringID] = {};
    }
    else if (localesCache[stringID][langCode] != undefined) {
      returnableString = localesCache[stringID][langCode];
      return returnableString;
    }
    await translate(ougi.localization[stringID].en, {to: langCode}).then(res => {
        returnableString = res.text;
    }).catch(err => {
        console.error(err);
    });
    localesCache[stringID][langCode] = returnableString;
    await fs.writeFile('./localesCache.txt', JSON.stringify(localesCache), console.error);
    ougi.backup('./localesCache.txt', localesChannel);
  }
  return returnableString;
}
