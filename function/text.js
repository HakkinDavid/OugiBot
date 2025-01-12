module.exports =

async function (msg, stringID, dynamic, raw) {
  let langCode = "en";
  if (typeof msg === 'object') {
    if (settingsOBJ.lang.hasOwnProperty(msg.author.id)) {
      langCode = settingsOBJ.lang[msg.author.id];
    }
    if (msg.channel.type === Discord.ChannelType.GuildText) {
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
    let fromCode;
    let potentialLinks = returnableString.match(/https{0,1}:\/\//gi) || [];
    if (potentialLinks.length > 0) {
      if (raw) { return { value: returnableString } };
      return returnableString;
    }
    if (dynamicLocales[langCode] === undefined) {
      dynamicLocales[langCode] = {};
    }
    else if (dynamicLocales[langCode][stringID] !== undefined) {
      returnableString = dynamicLocales[langCode][stringID].value;
      if (raw) { return { value: returnableString, fromCode: dynamicLocales[langCode][stringID].fromCode } };
      return returnableString;
    }
    else {
      let keyedTranslations = Object.keys(dynamicLocales[langCode]);
      let mostSimilar = stringSimilarity.findBestMatch(stringID, keyedTranslations).bestMatch;
      if (mostSimilar.rating * 100 > 75) {
        // ¿Tú qué dices Moris? Ehhhhh... 50 a 50.
        // Nah. 75.
        returnableString = dynamicLocales[langCode][mostSimilar.target].value;
        if (raw) { return { value: returnableString, fromCode: dynamicLocales[langCode][mostSimilar.target].fromCode } };
        return returnableString;
      }
    }
    stringEmoji = returnableString.match(/<:[A-Za-z0-9_]+:[0-9]+>/g);
    stringDiscordEmoji = returnableString.match(/(?<!\<):[A-Za-z0-9_]+:(?![0-9]+\>)/g);
    await translate(returnableString, {to: langCode, client: 'gtx'}).then(res => {
      if (res.from.language.iso !== langCode) {
        fromCode = res.from.language.iso;
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
    dynamicLocales[langCode][stringID] = { value: returnableString, fromCode };
    await ougi.writeFile(database.dynamicLocales.file, JSON.stringify(dynamicLocales, null, 4), console.error);
    await ougi.backup(database.dynamicLocales.file, dynamicLocalesChannel);
    if (raw) { return { value: returnableString, fromCode, stringEmoji, stringDiscordEmoji } };
    return returnableString;
  }

  if (ougi.localization.en[stringID] === undefined) {
    stringID = 'undeclaredString';
  }

  let returnableString;
  if (typeof ougi.localization[langCode] === 'undefined') returnableString = null;
  else returnableString = ougi.localization[langCode][stringID] || null;
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
    await translate(ougi.localization.en[stringID], {to: langCode, client: 'gtx'}).then(res => {
        returnableString = res.text;
    }).catch(err => {
        console.error(err);
    });
    localesCache[langCode][stringID] = returnableString;
    await ougi.writeFile(database.locales.file, JSON.stringify(localesCache, null, 4), console.error);
    await ougi.backup(database.locales.file, localesChannel);
  }

  return returnableString;
}
