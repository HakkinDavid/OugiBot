module.exports =

async function (msg, stringID) {
  let langSettings = JSON.parse(fs.readFileSync('./settings.txt')).lang;
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
  if (returnableString == undefined) {
    if (ougi.localization[stringID].en != undefined) {
      switch (langCode) {
        case "mx":
          langCode = "es";
        break;
      }
      await translate(ougi.localization[stringID].en, {to: langCode}).then(res => {
          returnableString = res.text;
      }).catch(err => {
          console.error(err);
      });
    }
  }
  return returnableString;
}
