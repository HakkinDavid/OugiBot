module.exports =

function () {
  if (!settingsOBJ || /* !mindOBJ || */ !localesCache || !dynamicLocales || !knowledgeBase) {
    if (!fs.existsSync(database.settings.file) || /* !fs.existsSync(database.neuro.file) || */ !fs.existsSync(database.locales.file) || !fs.existsSync(database.dynamicLocales.file) || !fs.existsSync(database.backup.file)) {
      return false;
    }
    global.settingsOBJ = ougi.readFile(database.settings.file);
    // global.mindOBJ = ougi.readFile(database.neuro.file);
    global.localesCache = ougi.readFile(database.locales.file);
    global.dynamicLocales = ougi.readFile(database.dynamicLocales.file);
    global.knowledgeBase = ougi.readFile(database.backup.file, 'utf-8');

    if (!settingsOBJ.hasOwnProperty("guildBump")) {
      console.log(colors.yellow("Settings OBJ guildBump property created."));
      settingsOBJ.guildBump = {};
    }
  }
  return true;
}
