const path = require('path');
const dbManager = require('./db')();

module.exports = function () {
  if (!settingsOBJ || !localesCache || !dynamicLocales || !knowledgeBase) {
    global.settingsOBJ = dbManager.getKV('settings', 'kv', 'settingsOBJ') || {};
    global.localesCache = dbManager.loadLocalesCache() || {};
    global.dynamicLocales = dbManager.loadDynamicLocales() || {};
    global.knowledgeBase = dbManager.loadKnowledgeBase() || {};
    global.rafflesOBJ = dbManager.loadRaffles() || {};

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
