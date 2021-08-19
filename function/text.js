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
  if (ougi.localization[stringID] === undefined) {
    let returnableString = stringID;
    if (langCode !== 'en') {
      await translate(returnableString, {to: langCode}).then(res => {
        returnableString = res.text;
      }).catch(err => {
          console.error(err);
      });
      localesCache[stringID] = {};
      localesCache[stringID][langCode] = returnableString;
      await fs.writeFile('./localesCache.txt', JSON.stringify(localesCache), console.error);
      await ougi.backup('./localesCache.txt', localesChannel);
    }
    return returnableString;
  }
  let returnableString = ougi.localization[stringID][langCode];
  if (returnableString === undefined && ougi.localization[stringID].en != undefined) {
    switch (langCode) {
      case "mx":
        langCode = "es";
      break;
    }
    if (localesCache[stringID] === undefined) {
      localesCache[stringID] = {};
    }
    else if (localesCache[stringID][langCode] !== undefined) {
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
    await ougi.backup('./localesCache.txt', localesChannel);
  }
  return returnableString;
}
