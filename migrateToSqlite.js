require('dotenv').config();
const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');
const dbManager = require('./function/db')();

console.log("==========================================");
console.log("🚀 Starting OugiBot Flat-File -> SQLite Migration");
console.log("==========================================");

function readLegacyFile(filename) {
    if (!fs.existsSync(filename)) {
        console.log(`⚠️ Legacy file ${filename} not found, skipping.`);
        return null;
    }
    const raw = fs.readFileSync(filename, 'utf-8').trim();
    if (!raw) {
        console.log(`⚠️ Legacy file ${filename} is empty, skipping.`);
        return null;
    }
    try {
        return JSON.parse(raw);
    } catch {
        try {
            const decrypted = CryptoJS.AES.decrypt(raw, process.env.CRYPT_KEY).toString(CryptoJS.enc.Utf8);
            if (!decrypted) return null;
            return JSON.parse(decrypted);
        } catch {
            console.log(`⚠️ Legacy file ${filename} could not be decrypted/parsed as JSON, skipping.`);
            return null;
        }
    }
}

async function runMigration() {
    // 1. Migrate settings.txt -> settings.db & economy.db
    console.log("\n📦 Migrating settings.txt...");
    const settings = readLegacyFile('./settings.txt');
    if (settings && Object.keys(settings).length > 0) {
        // Guarantee full 20-key schema
        if (!settings.banned) settings.banned = {};
        if (!settings.ignored) settings.ignored = [];
        if (!settings.ratelimit) settings.ratelimit = {};
        if (!settings.prefix) settings.prefix = {};
        if (!settings.blacklist) settings.blacklist = {};
        if (!settings.economy) settings.economy = {};
        if (!settings.logging) settings.logging = {};
        if (!settings.lang) settings.lang = {};
        if (!settings.guildNews) settings.guildNews = {};
        if (!settings.subscribers) settings.subscribers = [];
        if (!settings.surveys) settings.surveys = {};
        if (!settings.surveysAvailable) settings.surveysAvailable = {};
        if (!settings.AI) settings.AI = { description: {} };
        if (!settings.guildBump) settings.guildBump = {};
        if (!settings.patreonAdLastSeen) settings.patreonAdLastSeen = {};
        if (!settings.interactionsCounter) settings.interactionsCounter = {};
        if (!settings.patrons) settings.patrons = {};
        if (!settings.shortcuts) settings.shortcuts = {};
        if (!settings.nicknames) settings.nicknames = {};
        if (!settings.guildAdmins) settings.guildAdmins = {};

        dbManager.saveKV('settings', 'kv', 'settingsOBJ', settings);
        console.log("  ✅ Saved complete settingsOBJ into settings.db");

        // Migrate Economy data if present
        if (settings.economy) {
            const ecoDb = dbManager.getDb('economy');
            const saveGuildEco = ecoDb.prepare(`INSERT INTO guild_economy (guild_id, config) VALUES (?, ?) ON CONFLICT(guild_id) DO UPDATE SET config=excluded.config`);
            const saveUserEco = ecoDb.prepare(`INSERT INTO user_economy (guild_id, user_id, money, xp, level, worked) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(guild_id, user_id) DO UPDATE SET money=excluded.money, xp=excluded.xp, level=excluded.level, worked=excluded.worked`);

            const ecoTransaction = ecoDb.transaction((economyData) => {
                for (const [guildId, gData] of Object.entries(economyData)) {
                    saveGuildEco.run(guildId, JSON.stringify({
                        multiplier: gData.multiplier || 1,
                        channels: gData.channels || [],
                        currency: gData.currency || "$",
                        xp: gData.xp || "XP",
                        cooldown: gData.cooldown || 10
                    }));

                    if (gData.users) {
                        for (const [userId, uData] of Object.entries(gData.users)) {
                            saveUserEco.run(guildId, userId, uData.money || 0, uData.xp || 0, uData.level || 0, uData.worked || 0);
                        }
                    }
                }
            });
            ecoTransaction(settings.economy);
            console.log("  ✅ Migrated guild & user economy records into economy.db");
        }
    } else {
        console.log("  ℹ️ No valid legacy settings.txt found, preserving existing settings.db");
    }

    // 2. Migrate responses.txt (Knowledge Base) -> responses.db
    console.log("\n📦 Migrating responses.txt...");
    const responses = readLegacyFile('./responses.txt');
    if (responses && Object.keys(responses).length > 0) {
        dbManager.saveKnowledgeBase(responses);
        console.log(`  ✅ Migrated ${Object.keys(responses).length} triggers into responses.db`);
    } else {
        console.log("  ℹ️ No valid legacy responses.txt found, preserving existing responses.db");
    }

    // 3. Migrate embedPresets.txt -> embedPresets.db
    console.log("\n📦 Migrating embedPresets.txt...");
    const embeds = readLegacyFile('./embedPresets.txt');
    if (embeds && Object.keys(embeds).length > 0) {
        const embedsDb = dbManager.getDb('embedPresets');
        const stmt = embedsDb.prepare(`INSERT INTO presets (preset_key, data) VALUES (?, ?) ON CONFLICT(preset_key) DO UPDATE SET data=excluded.data`);
        const transaction = embedsDb.transaction((data) => {
            for (const [key, val] of Object.entries(data)) {
                stmt.run(key, JSON.stringify(val));
            }
        });
        transaction(embeds);
        console.log(`  ✅ Migrated ${Object.keys(embeds).length} embed presets into embedPresets.db`);
    } else {
        console.log("  ℹ️ No valid legacy embedPresets.txt found, preserving existing embedPresets.db");
    }

    // 4. Migrate localesCache.txt -> localesCache.db
    console.log("\n📦 Migrating localesCache.txt...");
    const locales = readLegacyFile('./localesCache.txt');
    if (locales && Object.keys(locales).length > 0) {
        const localesDb = dbManager.getDb('localesCache');
        const stmt = localesDb.prepare(`INSERT INTO locales (lang, string_id, translation) VALUES (?, ?, ?) ON CONFLICT(lang, string_id) DO UPDATE SET translation=excluded.translation`);
        const transaction = localesDb.transaction((data) => {
            for (const [lang, strings] of Object.entries(data)) {
                for (const [sId, trans] of Object.entries(strings)) {
                    stmt.run(lang, sId, trans);
                }
            }
        });
        transaction(locales);
        console.log("  ✅ Migrated static locales cache into localesCache.db");
    } else {
        console.log("  ℹ️ No valid legacy localesCache.txt found, preserving existing localesCache.db");
    }

    // 5. Migrate dynamicLocales.txt -> dynamicLocales.db
    console.log("\n📦 Migrating dynamicLocales.txt...");
    const dynamicLocales = readLegacyFile('./dynamicLocales.txt');
    if (dynamicLocales && Object.keys(dynamicLocales).length > 0) {
        const dLocalesDb = dbManager.getDb('dynamicLocales');
        const stmt = dLocalesDb.prepare(`INSERT INTO dynamic_locales (lang, string_id, value, from_code) VALUES (?, ?, ?, ?) ON CONFLICT(lang, string_id) DO UPDATE SET value=excluded.value, from_code=excluded.from_code`);
        const transaction = dLocalesDb.transaction((data) => {
            for (const [lang, phrases] of Object.entries(data)) {
                for (const [sId, obj] of Object.entries(phrases)) {
                    stmt.run(lang, sId, obj.value || '', obj.fromCode || 'en');
                }
            }
        });
        transaction(dynamicLocales);
        console.log("  ✅ Migrated dynamic locales cache into dynamicLocales.db");
    } else {
        console.log("  ℹ️ No valid legacy dynamicLocales.txt found, preserving existing dynamicLocales.db");
    }

    // 6. Migrate raffles.txt -> raffles.db
    console.log("\n📦 Migrating raffles.txt...");
    const raffles = readLegacyFile('./raffles.txt');
    if (raffles && Object.keys(raffles).length > 0) {
        const rafflesDb = dbManager.getDb('raffles');
        const stmt = rafflesDb.prepare(`INSERT INTO raffles (guild_id, data) VALUES (?, ?) ON CONFLICT(guild_id) DO UPDATE SET data=excluded.data`);
        const transaction = rafflesDb.transaction((data) => {
            for (const [guildId, val] of Object.entries(data)) {
                stmt.run(guildId, JSON.stringify(val));
            }
        });
        transaction(raffles);
        console.log(`  ✅ Migrated ${Object.keys(raffles).length} guild raffles records into raffles.db`);
    } else {
        console.log("  ℹ️ No valid legacy raffles.txt found, preserving existing raffles.db");
    }

    // 7. Migrate newsChannel.txt -> newsChannel.db
    console.log("\n📦 Migrating newsChannel.txt...");
    const newsData = readLegacyFile('./newsChannel.txt');
    if (newsData && (Array.isArray(newsData) ? newsData.length > 0 : Object.keys(newsData).length > 0)) {
        dbManager.saveKV('newsChannel', 'kv', 'newsData', newsData);
        console.log("  ✅ Migrated newsChannel records into newsChannel.db");
    } else {
        console.log("  ℹ️ No valid legacy newsChannel.txt found, preserving existing newsChannel.db");
    }

    // Flush all WAL transactions to disk
    dbManager.checkpointAll();

    console.log("\n==========================================");
    console.log("✨ Migration Completed Successfully!");
    console.log("==========================================");
}

runMigration().catch(console.error);
