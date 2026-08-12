const path = require('path');
const dbManager = require('./db')();

module.exports = function () {
    if (!settingsOBJ || !localesCache || !dynamicLocales || !knowledgeBase) {
        global.settingsOBJ = dbManager.getKV('settings', 'kv', 'settingsOBJ') || {};
        global.localesCache = dbManager.loadLocalesCache() || {};
        global.dynamicLocales = dbManager.loadDynamicLocales() || {};
        global.knowledgeBase = dbManager.loadKnowledgeBase() || {};
        global.rafflesOBJ = dbManager.loadRaffles() || {};
    }

    let missingProps = [];

    // Complete 20-key OugiBot settingsOBJ schema initialization
    if (!global.settingsOBJ.banned) missingProps.push("Missing settingsOBJ.banned");
    if (!global.settingsOBJ.ignored) missingProps.push("Missing settingsOBJ.ignored");
    if (!global.settingsOBJ.ratelimit) missingProps.push("Missing settingsOBJ.ratelimit");
    if (!global.settingsOBJ.prefix) missingProps.push("Missing settingsOBJ.prefix");
    if (!global.settingsOBJ.blacklist) missingProps.push("Missing settingsOBJ.blacklist");
    if (!global.settingsOBJ.economy) missingProps.push("Missing settingsOBJ.economy");
    if (!global.settingsOBJ.logging) missingProps.push("Missing settingsOBJ.logging");
    if (!global.settingsOBJ.lang) missingProps.push("Missing settingsOBJ.lang");
    if (!global.settingsOBJ.guildNews) missingProps.push("Missing settingsOBJ.guildNews");
    if (!global.settingsOBJ.subscribers) missingProps.push("Missing settingsOBJ.subscribers");
    if (!global.settingsOBJ.surveys) missingProps.push("Missing settingsOBJ.surveys");
    if (!global.settingsOBJ.surveysAvailable) missingProps.push("Missing settingsOBJ.surveysAvailable");
    if (!global.settingsOBJ.AI) missingProps.push("Missing global.settingsOBJ.AI");
    if (!global.settingsOBJ.guildBump) missingProps.push("Missing settingsOBJ.guildBump");
    if (!global.settingsOBJ.patreonAdLastSeen) missingProps.push("Missing settingsOBJ.patreonAdLastSeen");
    if (!global.settingsOBJ.interactionsCounter) missingProps.push("Missing settingsOBJ.interactionsCounter");
    if (!global.settingsOBJ.patrons) missingProps.push("Missing settingsOBJ.patrons");
    if (!global.settingsOBJ.shortcuts) missingProps.push("Missing settingsOBJ.shortcuts");
    if (!global.settingsOBJ.nicknames) missingProps.push("Missing settingsOBJ.nicknames");
    if (!global.settingsOBJ.guildAdmins) missingProps.push("Missing settingsOBJ.guildAdmins");

    if (missingProps.length > 0) {
        console.error(missingProps.join("\n"));
        return false;
    }
    return true;
};
