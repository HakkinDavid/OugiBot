module.exports =

async function (msg, stringID, dynamic) {
  let langCode = "en";
  if (typeof msg === 'object') {
    if (settingsOBJ.lang.hasOwnProperty(msg.author.id)) {
      langCode = settingsOBJ.lang[msg.author.id];
    }
    if (msg.channel.type === "text") {
      if (settingsOBJ.lang.hasOwnProperty(msg.guild.id)) {
        langCode = settingsOBJ.lang[msg.guild.id];
      }
    }
  }
  else if (typeof msg === 'string') {
    langCode = msg;
  }
  
  if (dynamic) {
    switch (langCode) {
      case "mx":
        langCode = "es";
      break;
    }
    let returnableString = stringID;
    if (dynamicLocales[langCode] === undefined) {
      dynamicLocales[langCode] = {};
    }
    else if (dynamicLocales[langCode][stringID] !== undefined) {
      returnableString = dynamicLocales[langCode][stringID];
      return returnableString;
    }
    stringEmoji = returnableString.match(/<:[A-Za-z0-9_]+:[0-9]+>/g);
    stringDiscordEmoji = returnableString.match(/(?<!\<):[A-Za-z0-9_]+:(?![0-9]+\>)/g);
    await translate(returnableString, {to: langCode}).then(res => {
      if (res.from.language.iso !== langCode) {
        returnableString = res.text;
        translatedEmoji = returnableString.match(/< {0,}:[A-Za-z0-9_ ]+: {0,}[0-9]+>/g);
        if (translatedEmoji !== null) {
          for (i=0; i < translatedEmoji.length; i++) {
            returnableString = returnableString.replace(translatedEmoji[i], stringEmoji[i]);
          }
        }
        translatedDiscordEmoji = returnableString.match(/(?<!\<): {0,}[A-Za-z0-9_]+:(?![0-9]+\>)/g);
        if (translatedDiscordEmoji !== null) {
          for (i=0; i < translatedDiscordEmoji.length; i++) {
            returnableString = returnableString.replace(translatedDiscordEmoji[i], stringDiscordEmoji[i]);
          }
        }
      }
    }).catch(err => {
        console.error(err);
    });
    dynamicLocales[langCode][stringID] = returnableString;
    await fs.writeFile('./dynamicLocales.txt', JSON.stringify(dynamicLocales, null, 4), 'utf-8', console.error);
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
    if (localesCache[langCode] === undefined) {
      localesCache[langCode] = {};
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
    await fs.writeFile('./localesCache.txt', JSON.stringify(localesCache, null, 4), 'utf-8', console.error);
    await ougi.backup('./localesCache.txt', localesChannel);
  }

  return returnableString;
}
