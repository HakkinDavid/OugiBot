const path = require('path');
const dbManager = require('./db')();

module.exports = function () {
  if (!settingsOBJ || !localesCache || !dynamicLocales || !knowledgeBase) {
    global.settingsOBJ = dbManager.getKV('settings', 'kv', 'settingsOBJ') || {};
    global.localesCache = dbManager.loadLocalesCache() || {};
    global.dynamicLocales = dbManager.loadDynamicLocales() || {};
    global.knowledgeBase = dbManager.loadKnowledgeBase() || {};
    global.rafflesOBJ = dbManager.loadRaffles() || {};

    // Complete 20-key OugiBot settingsOBJ schema initialization
    if (!global.settingsOBJ.banned) global.settingsOBJ.banned = {};
    if (!global.settingsOBJ.ignored) global.settingsOBJ.ignored = [];
    if (!global.settingsOBJ.ratelimit) global.settingsOBJ.ratelimit = {};
    if (!global.settingsOBJ.prefix) global.settingsOBJ.prefix = {};
    if (!global.settingsOBJ.blacklist) global.settingsOBJ.blacklist = {};
    if (!global.settingsOBJ.economy) global.settingsOBJ.economy = {};
    if (!global.settingsOBJ.logging) global.settingsOBJ.logging = {};
    if (!global.settingsOBJ.lang) global.settingsOBJ.lang = {};
    if (!global.settingsOBJ.guildNews) global.settingsOBJ.guildNews = {};
    if (!global.settingsOBJ.subscribers) global.settingsOBJ.subscribers = [];
    if (!global.settingsOBJ.surveys) global.settingsOBJ.surveys = {};
    if (!global.settingsOBJ.surveysAvailable) global.settingsOBJ.surveysAvailable = {};
    if (!global.settingsOBJ.AI) global.settingsOBJ.AI = { description: {} };
    if (!global.settingsOBJ.guildBump) global.settingsOBJ.guildBump = {};
    if (!global.settingsOBJ.patreonAdLastSeen) global.settingsOBJ.patreonAdLastSeen = {};
    if (!global.settingsOBJ.interactionsCounter) global.settingsOBJ.interactionsCounter = {};
    if (!global.settingsOBJ.patrons) global.settingsOBJ.patrons = {};
    if (!global.settingsOBJ.shortcuts) global.settingsOBJ.shortcuts = {};
    if (!global.settingsOBJ.nicknames) global.settingsOBJ.nicknames = {};
    if (!global.settingsOBJ.guildAdmins) global.settingsOBJ.guildAdmins = {};
  }
  return true;
};
