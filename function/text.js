module.exports =

async function (msg, stringID, dynamic) {
  let langCode = "en";
  if (settingsOBJ.lang.hasOwnProperty(msg.author.id)) {
    langCode = settingsOBJ.lang[msg.author.id]
  }
  if (msg.channel.type === "text") {
    if (settingsOBJ.lang.hasOwnProperty(msg.guild.id)) {
      langCode = settingsOBJ.lang[msg.guild.id];
    }
  }
  
  if (dynamic) {
    switch (langCode) {
      case "mx":
        langCode = "es";
      break;
    }
    let returnableString = stringID;
    await translate(returnableString, {to: langCode}).then(res => {
      if (res.from.language.iso !== langCode) {
        returnableString = res.text;
      }
    }).catch(err => {
        console.error(err);
    });
    if (dynamicLocales[langCode] === undefined) {
      dynamicLocales[langCode] = {};
    }
    dynamicLocales[langCode][stringID] = returnableString;
    await fs.writeFile('./dynamicLocales.txt', JSON.stringify(dynamicLocales, null, 4), console.error);
    await ougi.backup('./dynamicLocales.txt', dynamicLocalesChannel);
    return returnableString;
  }

  if (ougi.localization.en[stringID] === undefined) {
    stringID = 'undeclaredString';
  }

  let returnableString = ougi.localization[langCode][stringID] || null;
  if (returnableString === null && ougi.localization.en[stringID] !== undefined) {
    switch (langCode) {
      case "mx":
        langCode = "es";
      break;
    }
    if (localesCache[stringID] === undefined) {
      localesCache[stringID] = {};
    }
    else if (localesCache[langCode][stringID] !== undefined) {
      returnableString = localesCache[langCode][stringID];
      return returnableString;
    }
    await translate(ougi.localization.en[stringID], {to: langCode}).then(res => {
        returnableString = res.text;
    }).catch(err => {
        console.error(err);
    });
    localesCache[langCode][stringID] = returnableString;
    await fs.writeFile('./localesCache.txt', JSON.stringify(localesCache, null, 4), console.error);
    await ougi.backup('./localesCache.txt', localesChannel);
  }

  return returnableString;
}
