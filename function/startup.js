const path = require('path');
const dbManager = require('./db')();

module.exports = function () {
  if (!settingsOBJ || !localesCache || !dynamicLocales || !knowledgeBase) {
    if (!fs.existsSync(database.settings.file) || !fs.existsSync(database.locales.file) || !fs.existsSync(database.dynamicLocales.file) || !fs.existsSync(database.backup.file)) {
      return false;
    }

    // Auto-migrate flat files to SQLite if SQLite is empty
    const settingsDb = dbManager.getDb('settings');
    const existingSettings = settingsDb.prepare("SELECT value FROM kv WHERE key = 'settingsOBJ'").get();
    
    if (!existingSettings && fs.existsSync('./migrateToSqlite.js')) {
      console.log("[Startup] SQLite empty, executing automated flat-file -> SQLite migration...");
      try {
        require('../migrateToSqlite');
      } catch (err) {
        console.error("[Startup] Auto-migration error:", err);
      }
    }

    global.settingsOBJ = dbManager.getKV('settings', 'kv', 'settingsOBJ') || ougi.readFile(database.settings.file) || {};
    global.localesCache = ougi.readFile(database.locales.file) || {};
    global.dynamicLocales = ougi.readFile(database.dynamicLocales.file) || {};
    global.knowledgeBase = dbManager.loadKnowledgeBase() || ougi.readFile(database.backup.file, 'utf-8') || {};
    global.rafflesOBJ = ougi.readFile(database.raffles.file) || {};

    if (!global.settingsOBJ.lang) global.settingsOBJ.lang = {};
    if (!global.settingsOBJ.prefix) global.settingsOBJ.prefix = {};
    if (!global.settingsOBJ.banned) global.settingsOBJ.banned = {};
    if (!global.settingsOBJ.blacklist) global.settingsOBJ.blacklist = {};
    if (!global.settingsOBJ.ratelimit) global.settingsOBJ.ratelimit = {};
    if (!global.settingsOBJ.patrons) global.settingsOBJ.patrons = {};
    if (!global.settingsOBJ.economy) global.settingsOBJ.economy = {};
    if (!global.settingsOBJ.shortcuts) global.settingsOBJ.shortcuts = {};
    if (!global.settingsOBJ.guildBump) global.settingsOBJ.guildBump = {};
    if (!global.settingsOBJ.ignored) global.settingsOBJ.ignored = [];
  }
  return true;
};
