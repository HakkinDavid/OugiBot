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
    const raw = fs.readFileSync(filename, 'utf-8');
    try {
        return JSON.parse(raw);
    } catch {
        try {
            const decrypted = CryptoJS.AES.decrypt(raw, process.env.CRYPT_KEY).toString(CryptoJS.enc.Utf8);
            return JSON.parse(decrypted);
        } catch (err) {
            console.error(`❌ Failed to decrypt/parse ${filename}:`, err);
            return null;
        }
    }
}

async function runMigration() {
    // 1. Migrate settings.txt -> settings.db & economy.db
    console.log("\n📦 Migrating settings.txt...");
    const settings = readLegacyFile('./settings.txt');
    if (settings) {
        dbManager.saveKV('settings', 'kv', 'settingsOBJ', settings);
        console.log("  ✅ Saved settingsOBJ into settings.db");

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
    }

    // 2. Migrate responses.txt (Knowledge Base) -> responses.db
    console.log("\n📦 Migrating responses.txt...");
    const responses = readLegacyFile('./responses.txt');
    if (responses) {
        dbManager.saveKnowledgeBase(responses);
        console.log(`  ✅ Migrated ${Object.keys(responses).length} triggers into responses.db`);
    }

    // 3. Migrate embedPresets.txt -> embedPresets.db
    console.log("\n📦 Migrating embedPresets.txt...");
    const embeds = readLegacyFile('./embedPresets.txt');
    if (embeds) {
        const embedsDb = dbManager.getDb('embedPresets');
        const stmt = embedsDb.prepare(`INSERT INTO presets (preset_key, data) VALUES (?, ?) ON CONFLICT(preset_key) DO UPDATE SET data=excluded.data`);
        const transaction = embedsDb.transaction((data) => {
            for (const [key, val] of Object.entries(data)) {
                stmt.run(key, JSON.stringify(val));
            }
        });
        transaction(embeds);
        console.log(`  ✅ Migrated ${Object.keys(embeds).length} embed presets into embedPresets.db`);
    }

    // 4. Migrate localesCache.txt -> localesCache.db
    console.log("\n📦 Migrating localesCache.txt...");
    const locales = readLegacyFile('./localesCache.txt');
    if (locales) {
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
    }

    // 5. Migrate dynamicLocales.txt -> dynamicLocales.db
    console.log("\n📦 Migrating dynamicLocales.txt...");
    const dynamicLocales = readLegacyFile('./dynamicLocales.txt');
    if (dynamicLocales) {
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
    }

    // 6. Migrate raffles.txt -> raffles.db
    console.log("\n📦 Migrating raffles.txt...");
    const raffles = readLegacyFile('./raffles.txt');
    if (raffles) {
        const rafflesDb = dbManager.getDb('raffles');
        const stmt = rafflesDb.prepare(`INSERT INTO raffles (guild_id, data) VALUES (?, ?) ON CONFLICT(guild_id) DO UPDATE SET data=excluded.data`);
        const transaction = rafflesDb.transaction((data) => {
            for (const [guildId, val] of Object.entries(data)) {
                stmt.run(guildId, JSON.stringify(val));
            }
        });
        transaction(raffles);
        console.log(`  ✅ Migrated ${Object.keys(raffles).length} guild raffles records into raffles.db`);
    }

    // 7. Migrate newsChannel.txt -> newsChannel.db
    console.log("\n📦 Migrating newsChannel.txt...");
    const newsData = readLegacyFile('./newsChannel.txt');
    if (newsData) {
        const newsDb = dbManager.getDb('newsChannel');
        dbManager.saveKV('newsChannel', 'kv', 'newsData', newsData);
        console.log("  ✅ Migrated newsChannel records into newsChannel.db");
    }

    console.log("\n==========================================");
    console.log("✨ Migration Completed Successfully!");
    console.log("==========================================");
}

runMigration().catch(console.error);
