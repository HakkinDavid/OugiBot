const Database = require('better-sqlite3');
const path = require('node:path');
const fs = require('fs');

class OugiDatabaseManager {
    constructor() {
        this.databases = {};
        this.initialized = false;
    }

    getDb(name) {
        if (!this.initialized) {
            this.init();
        }
        if (!this.databases[name]) {
            const dbPath = path.join(__dirname, '..', `${name}.db`);
            const db = new Database(dbPath);
            db.pragma('journal_mode = DELETE');
            this.databases[name] = db;
        }
        return this.databases[name];
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;

        // 1. Settings Table
        const settingsDb = this.getDb('settings');
        settingsDb.exec(`
            CREATE TABLE IF NOT EXISTS kv (
                key TEXT PRIMARY KEY,
                value TEXT
            );
        `);

        // 2. Responses (Knowledge Base) Table
        const responsesDb = this.getDb('responses');
        responsesDb.exec(`
            CREATE TABLE IF NOT EXISTS responses (
                trigger TEXT PRIMARY KEY,
                replies TEXT
            );
        `);

        // 3. Embed Presets Table
        const embedsDb = this.getDb('embedPresets');
        embedsDb.exec(`
            CREATE TABLE IF NOT EXISTS presets (
                preset_key TEXT PRIMARY KEY,
                data TEXT
            );
        `);

        // 4. Locales Cache Table
        const localesDb = this.getDb('localesCache');
        localesDb.exec(`
            CREATE TABLE IF NOT EXISTS locales (
                lang TEXT,
                string_id TEXT,
                translation TEXT,
                PRIMARY KEY (lang, string_id)
            );
        `);

        // 5. Dynamic Locales Table
        const dynamicLocalesDb = this.getDb('dynamicLocales');
        dynamicLocalesDb.exec(`
            CREATE TABLE IF NOT EXISTS dynamic_locales (
                lang TEXT,
                string_id TEXT,
                value TEXT,
                from_code TEXT,
                PRIMARY KEY (lang, string_id)
            );
        `);

        // 6. Raffles Table — KV blob strategy (matches runtime access pattern)
        const rafflesDb = this.getDb('raffles');
        rafflesDb.exec(`
            CREATE TABLE IF NOT EXISTS kv (
                key TEXT PRIMARY KEY,
                value TEXT
            );
        `);

        // 7. Economy Tables — fully normalized
        const economyDb = this.getDb('economy');
        economyDb.exec(`
            CREATE TABLE IF NOT EXISTS guild_economy (
                guild_id    TEXT PRIMARY KEY,
                multiplier  REAL DEFAULT 1,
                channels    TEXT DEFAULT '[]',
                currency    TEXT DEFAULT '$',
                xp_label    TEXT DEFAULT 'XP',
                cooldown    INTEGER DEFAULT 10,
                disabled    INTEGER DEFAULT 0
            );
            CREATE TABLE IF NOT EXISTS user_economy (
                guild_id    TEXT,
                user_id     TEXT,
                money       INTEGER DEFAULT 0,
                xp          INTEGER DEFAULT 0,
                level       INTEGER DEFAULT 0,
                worked      INTEGER DEFAULT 0,
                last_daily  INTEGER DEFAULT 0,
                PRIMARY KEY (guild_id, user_id)
            );
            CREATE TABLE IF NOT EXISTS user_inventory (
                guild_id    TEXT,
                user_id     TEXT,
                item_id     TEXT,
                quantity    INTEGER DEFAULT 1,
                PRIMARY KEY (guild_id, user_id, item_id)
            );
            CREATE TABLE IF NOT EXISTS user_badges (
                guild_id    TEXT,
                user_id     TEXT,
                badge_id    TEXT,
                earned_at   INTEGER,
                PRIMARY KEY (guild_id, user_id, badge_id)
            );
            CREATE TABLE IF NOT EXISTS shop_items (
                guild_id    TEXT,
                item_id     TEXT,
                name        TEXT,
                price       INTEGER,
                role_id     TEXT,
                PRIMARY KEY (guild_id, item_id)
            );
        `);

        // 8. Reminders Table
        const remindersDb = this.getDb('reminders');
        remindersDb.exec(`
            CREATE TABLE IF NOT EXISTS active_reminders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                channel_id TEXT,
                guild_id TEXT,
                message TEXT,
                trigger_at INTEGER,
                created_at INTEGER
            );
        `);

        // 9. Surveys & Subscribers Table
        const surveysDb = this.getDb('surveys');
        surveysDb.exec(`
            CREATE TABLE IF NOT EXISTS surveys (
                survey_id TEXT PRIMARY KEY,
                data TEXT
            );
            CREATE TABLE IF NOT EXISTS subscribers (
                user_id TEXT PRIMARY KEY,
                subscribed_at INTEGER
            );
        `);

        // 10. News Channel Table
        const newsDb = this.getDb('newsChannel');
        newsDb.exec(`
            CREATE TABLE IF NOT EXISTS news_channels (
                guild_id TEXT PRIMARY KEY,
                channel_id TEXT
            );
            CREATE TABLE IF NOT EXISTS kv (
                key TEXT PRIMARY KEY,
                value TEXT
            );
        `);
    }

    unloadAll() {
        global.vc = {};
        global.settingsOBJ = null;
        global.mindOBJ = null;
        global.localesCache = null;
        global.dynamicLocales = null;
        global.knowledgeBase = null;
        global.rafflesOBJ = null;

        global.ammo = {};
        global.reloadedAmmo = {};
        global.interactions = {};

        global.database = {
            settings: { id: channels.settings, file: './settings.db', done: false },
            backup: { id: channels.backup, file: './responses.db', done: false },
            embeds: { id: channels.embeds, file: './embedPresets.db', done: false },
            news: { id: channels.news, file: './newsChannel.db', done: false },
            locales: { id: channels.locales, file: './localesCache.db', done: false },
            dynamicLocales: { id: channels.dynamicLocales, file: './dynamicLocales.db', done: false },
            raffles: { id: channels.raffles, file: './raffles.db', done: false },
            economy: { id: channels.economy, file: './economy.db', done: false }
        };
    }

    // KV Save / Load for Settings
    saveKV(dbName, tableName, key, value) {
        if (dbName === 'settings' && key === 'settingsOBJ') {
            if (!value || typeof value !== 'object' || Array.isArray(value)) {
                console.error("[CRITICAL SAFEGUARD] Attempted to save invalid settingsOBJ into settings.db, operation aborted!");
                return;
            }
            const requiredKeys = ['banned', 'ignored', 'ratelimit', 'prefix', 'blacklist', 'logging', 'lang', 'guildNews', 'subscribers', 'surveys', 'surveysAvailable', 'AI', 'guildBump', 'patreonAdLastSeen', 'interactionsCounter', 'patrons', 'shortcuts', 'nicknames', 'guildAdmins'];
            const missingKeys = requiredKeys.filter(k => !(k in value));
            if (missingKeys.length > 0) {
                console.error(`[CRITICAL SAFEGUARD] settingsOBJ is missing ${missingKeys.length} schema keys (${missingKeys.join(', ')}). Save operation aborted to prevent truncation!`);
                return;
            }
        }
        const db = this.getDb(dbName);
        const stmt = db.prepare(`INSERT INTO ${tableName} (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value`);
        stmt.run(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    }

    getKV(dbName, tableName, key, parseJson = true) {
        const db = this.getDb(dbName);
        const stmt = db.prepare(`SELECT value FROM ${tableName} WHERE key = ?`);
        const row = stmt.get(key);
        if (!row) return null;
        return parseJson ? JSON.parse(row.value) : row.value;
    }

    // Responses (Knowledge Base) helpers
    loadKnowledgeBase() {
        const db = this.getDb('responses');
        const rows = db.prepare(`SELECT trigger, replies FROM responses`).all();
        const kb = {};
        for (const row of rows) {
            try {
                kb[row.trigger] = JSON.parse(row.replies);
            } catch {
                kb[row.trigger] = [];
            }
        }
        return kb;
    }

    saveKnowledgeBase(kb) {
        const db = this.getDb('responses');
        const insert = db.prepare(`INSERT INTO responses (trigger, replies) VALUES (?, ?) ON CONFLICT(trigger) DO UPDATE SET replies=excluded.replies`);
        const deleteStmt = db.prepare(`DELETE FROM responses WHERE trigger = ?`);
        const transaction = db.transaction((data) => {
            for (const [trigger, replies] of Object.entries(data)) {
                if (!replies || replies.length === 0) {
                    deleteStmt.run(trigger);
                } else {
                    insert.run(trigger, JSON.stringify(replies));
                }
            }
        });
        transaction(kb);
    }

    loadLocalesCache() {
        const db = this.getDb('localesCache');
        const rows = db.prepare('SELECT lang, string_id, translation FROM locales').all();
        if (rows.length === 0) return null;
        const cache = {};
        for (const row of rows) {
            if (!cache[row.lang]) cache[row.lang] = {};
            cache[row.lang][row.string_id] = row.translation;
        }
        return cache;
    }

    saveStaticLocale(lang, stringId, translation) {
        const db = this.getDb('localesCache');
        db.prepare(`INSERT INTO locales (lang, string_id, translation) VALUES (?, ?, ?) ON CONFLICT(lang, string_id) DO UPDATE SET translation=excluded.translation`).run(lang, stringId, translation);
    }

    loadDynamicLocales() {
        const db = this.getDb('dynamicLocales');
        const rows = db.prepare('SELECT lang, string_id, value, from_code FROM dynamic_locales').all();
        if (rows.length === 0) return null;
        const cache = {};
        for (const row of rows) {
            if (!cache[row.lang]) cache[row.lang] = {};
            cache[row.lang][row.string_id] = { value: row.value, fromCode: row.from_code };
        }
        return cache;
    }

    saveDynamicLocale(lang, stringId, value, fromCode) {
        const db = this.getDb('dynamicLocales');
        db.prepare(`INSERT INTO dynamic_locales (lang, string_id, value, from_code) VALUES (?, ?, ?, ?) ON CONFLICT(lang, string_id) DO UPDATE SET value=excluded.value, from_code=excluded.from_code`).run(lang, stringId, value, fromCode || null);
    }

    loadRaffles() {
        return this.getKV('raffles', 'kv', 'rafflesOBJ') || {};
    }

    loadEmbedPresets() {
        const db = this.getDb('embedPresets');
        const rows = db.prepare('SELECT preset_key, data FROM presets').all();
        const presets = {};
        for (const row of rows) {
            try {
                presets[row.preset_key] = JSON.parse(row.data);
            } catch { }
        }
        return presets;
    }

    saveEmbedPreset(presetKey, data) {
        const db = this.getDb('embedPresets');
        const stmt = db.prepare('INSERT INTO presets (preset_key, data) VALUES (?, ?) ON CONFLICT(preset_key) DO UPDATE SET data=excluded.data');
        stmt.run(presetKey, JSON.stringify(data));
    }

    deleteEmbedPreset(presetKey) {
        const db = this.getDb('embedPresets');
        const stmt = db.prepare('DELETE FROM presets WHERE preset_key = ?');
        stmt.run(presetKey);
    }

    loadNews() {
        const db = this.getDb('newsChannel');
        const rows = db.prepare("SELECT value FROM kv WHERE key = 'newsList'").get();
        if (!rows) return [];
        try {
            return JSON.parse(rows.value);
        } catch {
            return [];
        }
    }

    addNews(newsItem) {
        const list = this.loadNews();
        list.push(newsItem);
        this.saveKV('newsChannel', 'kv', 'newsList', list);
    }

    // ─── Economy ──────────────────────────────────────────────────────────────

    getGuildEconomy(guildId) {
        const db = this.getDb('economy');
        let row = db.prepare('SELECT * FROM guild_economy WHERE guild_id = ?').get(guildId);
        if (!row) {
            db.prepare(`INSERT OR IGNORE INTO guild_economy (guild_id) VALUES (?)`).run(guildId);
            row = db.prepare('SELECT * FROM guild_economy WHERE guild_id = ?').get(guildId);
        }
        return {
            guild_id: row.guild_id,
            multiplier: row.multiplier,
            channels: JSON.parse(row.channels || '[]'),
            currency: row.currency,
            xp_label: row.xp_label,
            cooldown: row.cooldown,
            disabled: !!row.disabled
        };
    }

    saveGuildEconomy(guildId, config) {
        const db = this.getDb('economy');
        db.prepare(`
            INSERT INTO guild_economy (guild_id, multiplier, channels, currency, xp_label, cooldown, disabled)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(guild_id) DO UPDATE SET
                multiplier=excluded.multiplier,
                channels=excluded.channels,
                currency=excluded.currency,
                xp_label=excluded.xp_label,
                cooldown=excluded.cooldown,
                disabled=excluded.disabled
        `).run(
            guildId,
            config.multiplier ?? 1,
            JSON.stringify(config.channels ?? []),
            config.currency ?? '$',
            config.xp_label ?? 'XP',
            config.cooldown ?? 10,
            config.disabled ? 1 : 0
        );
    }

    getUser(guildId, userId) {
        const db = this.getDb('economy');
        let row = db.prepare('SELECT * FROM user_economy WHERE guild_id = ? AND user_id = ?').get(guildId, userId);
        if (!row) {
            db.prepare(`INSERT OR IGNORE INTO user_economy (guild_id, user_id) VALUES (?, ?)`).run(guildId, userId);
            row = db.prepare('SELECT * FROM user_economy WHERE guild_id = ? AND user_id = ?').get(guildId, userId);
        }
        return { guild_id: row.guild_id, user_id: row.user_id, money: row.money, xp: row.xp, level: row.level, worked: row.worked, last_daily: row.last_daily };
    }

    saveUser(guildId, userId, data) {
        const db = this.getDb('economy');
        db.prepare(`
            INSERT INTO user_economy (guild_id, user_id, money, xp, level, worked, last_daily)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(guild_id, user_id) DO UPDATE SET
                money=excluded.money, xp=excluded.xp, level=excluded.level,
                worked=excluded.worked, last_daily=excluded.last_daily
        `).run(guildId, userId, data.money ?? 0, data.xp ?? 0, data.level ?? 0, data.worked ?? 0, data.last_daily ?? 0);
    }

    getUserInventory(guildId, userId) {
        return this.getDb('economy').prepare('SELECT item_id, quantity FROM user_inventory WHERE guild_id = ? AND user_id = ?').all(guildId, userId);
    }

    addInventoryItem(guildId, userId, itemId, qty = 1) {
        this.getDb('economy').prepare(`
            INSERT INTO user_inventory (guild_id, user_id, item_id, quantity) VALUES (?, ?, ?, ?)
            ON CONFLICT(guild_id, user_id, item_id) DO UPDATE SET quantity=quantity + excluded.quantity
        `).run(guildId, userId, itemId, qty);
    }

    getUserBadges(guildId, userId) {
        return this.getDb('economy').prepare('SELECT badge_id, earned_at FROM user_badges WHERE guild_id = ? AND user_id = ?').all(guildId, userId);
    }

    addBadge(guildId, userId, badgeId) {
        this.getDb('economy').prepare(`INSERT OR IGNORE INTO user_badges (guild_id, user_id, badge_id, earned_at) VALUES (?, ?, ?, ?)`).run(guildId, userId, badgeId, Date.now());
    }

    getShopItems(guildId) {
        return this.getDb('economy').prepare('SELECT item_id, name, price, role_id FROM shop_items WHERE guild_id = ?').all(guildId);
    }

    addShopItem(guildId, itemId, name, price, roleId = null) {
        this.getDb('economy').prepare(`
            INSERT INTO shop_items (guild_id, item_id, name, price, role_id) VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(guild_id, item_id) DO UPDATE SET name=excluded.name, price=excluded.price, role_id=excluded.role_id
        `).run(guildId, itemId, name, price, roleId);
    }

    removeShopItem(guildId, itemId) {
        this.getDb('economy').prepare('DELETE FROM shop_items WHERE guild_id = ? AND item_id = ?').run(guildId, itemId);
    }

    getLeaderboard(guildId, limit = 10) {
        return this.getDb('economy').prepare('SELECT user_id, money, xp, level FROM user_economy WHERE guild_id = ? ORDER BY money DESC LIMIT ?').all(guildId, limit);
    }

    // ─── Settings helpers — lang ─────────────────────────────────────────────

    getLang(id) { return global.settingsOBJ?.lang?.[id] ?? null; }

    setLang(id, code) {
        if (code === 'default') {
            delete global.settingsOBJ.lang[id];
        } else {
            global.settingsOBJ.lang[id] = code;
        }
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    // ─── Settings helpers — prefix ───────────────────────────────────────────

    getPrefix(guildId) { return global.settingsOBJ?.prefix?.[guildId] ?? null; }

    setPrefix(guildId, prefix) {
        global.settingsOBJ.prefix[guildId] = prefix;
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    // ─── Settings helpers — logging ───────────────────────────────────────────

    getLogChannel(guildId) { return global.settingsOBJ?.logging?.[guildId] ?? null; }

    setLogChannel(guildId, channelId) {
        global.settingsOBJ.logging[guildId] = channelId;
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    deleteLogChannel(guildId) {
        delete global.settingsOBJ.logging[guildId];
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    // ─── Settings helpers — guildNews ─────────────────────────────────────────

    getNewsChannel(guildId) { return global.settingsOBJ?.guildNews?.[guildId] ?? null; }

    setNewsChannel(guildId, channelId) {
        global.settingsOBJ.guildNews[guildId] = channelId;
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    deleteNewsChannel(guildId) {
        delete global.settingsOBJ.guildNews[guildId];
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    // ─── Settings helpers — guildBump ─────────────────────────────────────────

    getBumpConfig(guildId) { return global.settingsOBJ?.guildBump?.[guildId] ?? null; }

    setBumpConfig(guildId, config) {
        global.settingsOBJ.guildBump[guildId] = config;
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    deleteBumpConfig(guildId) {
        delete global.settingsOBJ.guildBump[guildId];
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    // ─── Settings helpers — guildAdmins ──────────────────────────────────────

    getGuildAdmins(guildId) { return global.settingsOBJ?.guildAdmins?.[guildId] ?? []; }

    addGuildAdmin(guildId, userId) {
        if (!Array.isArray(global.settingsOBJ.guildAdmins[guildId])) global.settingsOBJ.guildAdmins[guildId] = [];
        if (!global.settingsOBJ.guildAdmins[guildId].includes(userId)) global.settingsOBJ.guildAdmins[guildId].push(userId);
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    removeGuildAdmin(guildId, userId) {
        if (!Array.isArray(global.settingsOBJ.guildAdmins[guildId])) return;
        global.settingsOBJ.guildAdmins[guildId] = global.settingsOBJ.guildAdmins[guildId].filter(id => id !== userId);
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    // ─── Settings helpers — blacklist ─────────────────────────────────────────

    getBlacklist(guildId) { return global.settingsOBJ?.blacklist?.[guildId] ?? []; }

    blacklistTrigger(guildId, trigger) {
        if (!Array.isArray(global.settingsOBJ.blacklist[guildId])) global.settingsOBJ.blacklist[guildId] = [];
        if (!global.settingsOBJ.blacklist[guildId].includes(trigger)) global.settingsOBJ.blacklist[guildId].push(trigger);
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    unblacklistTrigger(guildId, trigger) {
        if (!Array.isArray(global.settingsOBJ.blacklist[guildId])) return false;
        const idx = global.settingsOBJ.blacklist[guildId].findIndex(t => t.toLowerCase() === trigger.toLowerCase());
        if (idx === -1) return false;
        global.settingsOBJ.blacklist[guildId].splice(idx, 1);
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
        return true;
    }

    // ─── Settings helpers — banned ────────────────────────────────────────────

    getBan(userId) { return global.settingsOBJ?.banned?.[userId] ?? null; }

    banUser(userId, reason, until) {
        global.settingsOBJ.banned[userId] = { reason, until };
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    // ─── Settings helpers — ignored ───────────────────────────────────────────

    isIgnored(userId) { return global.settingsOBJ?.ignored?.includes(userId) ?? false; }

    ignoreUser(userId) {
        if (!global.settingsOBJ.ignored.includes(userId)) global.settingsOBJ.ignored.push(userId);
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    unignoreUser(userId) {
        const idx = global.settingsOBJ.ignored.indexOf(userId);
        if (idx !== -1) global.settingsOBJ.ignored.splice(idx, 1);
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    // ─── Settings helpers — subscribers ──────────────────────────────────────

    isSubscriber(userId) { return global.settingsOBJ?.subscribers?.includes(userId) ?? false; }

    addSubscriber(userId) {
        if (!global.settingsOBJ.subscribers.includes(userId)) global.settingsOBJ.subscribers.push(userId);
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    removeSubscriber(userId) {
        const idx = global.settingsOBJ.subscribers.indexOf(userId);
        if (idx !== -1) global.settingsOBJ.subscribers.splice(idx, 1);
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    // ─── Settings helpers — patrons ───────────────────────────────────────────

    getPatron(userId) { return global.settingsOBJ?.patrons?.[userId] ?? null; }

    upsertPatron(userId, data) {
        if (!global.settingsOBJ.patrons) global.settingsOBJ.patrons = {};
        global.settingsOBJ.patrons[userId] = Object.assign(global.settingsOBJ.patrons[userId] || {}, data);
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    // ─── Settings helpers — nicknames ─────────────────────────────────────────

    getNicknames(guildId) { return global.settingsOBJ?.nicknames?.[guildId] ?? {}; }

    setNickname(guildId, userId, name) {
        if (!global.settingsOBJ.nicknames[guildId]) global.settingsOBJ.nicknames[guildId] = {};
        global.settingsOBJ.nicknames[guildId][userId] = name;
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    // ─── Settings helpers — shortcuts ─────────────────────────────────────────

    getShortcuts(guildId) { return global.settingsOBJ?.shortcuts?.[guildId] ?? {}; }

    setShortcut(guildId, emojiKey, data) {
        if (!global.settingsOBJ.shortcuts[guildId]) global.settingsOBJ.shortcuts[guildId] = {};
        global.settingsOBJ.shortcuts[guildId][emojiKey] = data;
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    deleteShortcut(guildId, emojiKey) {
        if (global.settingsOBJ.shortcuts?.[guildId]) {
            delete global.settingsOBJ.shortcuts[guildId][emojiKey];
            this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
        }
    }

    // ─── Settings helpers — AI ────────────────────────────────────────────────

    getAIDescription(guildId) { return global.settingsOBJ?.AI?.description?.[guildId] ?? null; }

    setAIDescription(guildId, desc) {
        if (!global.settingsOBJ.AI) global.settingsOBJ.AI = { description: {} };
        if (!global.settingsOBJ.AI.description) global.settingsOBJ.AI.description = {};
        global.settingsOBJ.AI.description[guildId] = desc;
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    // ─── Settings helpers — surveys ───────────────────────────────────────────

    getSurvey(surveyId) { return global.settingsOBJ?.surveysAvailable?.[surveyId] ?? null; }

    upsertSurvey(surveyId, data) {
        global.settingsOBJ.surveysAvailable[surveyId] = data;
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    markSurveySeen(userId, surveyId) {
        if (!global.settingsOBJ.surveys[userId]) global.settingsOBJ.surveys[userId] = [];
        if (!global.settingsOBJ.surveys[userId].includes(surveyId)) {
            global.settingsOBJ.surveys[userId].push(surveyId);
        }
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    recordSurveyVote(surveyId, userId, voteKey) {
        const survey = global.settingsOBJ.surveysAvailable[surveyId];
        if (!survey) return;
        // Remove any prior vote
        ['yes', 'no'].forEach(k => {
            const idx = survey[k].indexOf(userId);
            if (idx !== -1) survey[k].splice(idx, 1);
        });
        survey[voteKey].push(userId);
        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }

    incrementSurveyPoppedUp(surveyId) {
        if (global.settingsOBJ.surveysAvailable[surveyId]) {
            global.settingsOBJ.surveysAvailable[surveyId].poppedUp++;
            this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
        }
    }

    endSurvey(surveyId) {
        if (global.settingsOBJ.surveysAvailable[surveyId]) {
            global.settingsOBJ.surveysAvailable[surveyId].ended = new Date().getTime();
            this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
        }
    }

    // ─── Interaction & Ad counter helper ────────────────────────────────────

    recordInteraction(userId, channelId, now) {
        if (!global.settingsOBJ.patreonAdLastSeen) global.settingsOBJ.patreonAdLastSeen = { users: {}, channels: {} };
        if (!global.settingsOBJ.interactionsCounter) global.settingsOBJ.interactionsCounter = { users: {}, channels: {} };
        if (!global.settingsOBJ.interactionsCounter.users) global.settingsOBJ.interactionsCounter.users = {};
        if (!global.settingsOBJ.interactionsCounter.channels) global.settingsOBJ.interactionsCounter.channels = {};

        if (!global.settingsOBJ.interactionsCounter.users[userId]) global.settingsOBJ.interactionsCounter.users[userId] = 0;
        if (!global.settingsOBJ.interactionsCounter.channels[channelId]) global.settingsOBJ.interactionsCounter.channels[channelId] = 0;

        const isPatron = Boolean(global.settingsOBJ.patrons?.[userId]);
        const channelCount = global.settingsOBJ.interactionsCounter.channels[channelId];
        let showAd = false;

        if (!isPatron && channelCount !== 0 && channelCount % 15 === 0) {
            if (!global.settingsOBJ.patreonAdLastSeen.users) global.settingsOBJ.patreonAdLastSeen.users = {};
            if (!global.settingsOBJ.patreonAdLastSeen.channels) global.settingsOBJ.patreonAdLastSeen.channels = {};
            global.settingsOBJ.patreonAdLastSeen.users[userId] = now;
            global.settingsOBJ.patreonAdLastSeen.channels[channelId] = now;
            showAd = true;
        }

        global.settingsOBJ.interactionsCounter.users[userId] += 1;
        global.settingsOBJ.interactionsCounter.channels[channelId] += 1;

        this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
        return showAd;
    }

    // ─── Raffles helper ────────────────────────────────────────────────────────

    saveRaffles() {
        if (global.rafflesOBJ) {
            this.saveKV('raffles', 'kv', 'rafflesOBJ', global.rafflesOBJ);
        }
    }

    // ─── KnowledgeBase helpers ─────────────────────────────────────────────────

    addKBReply(trigger, response) {
        if (!global.knowledgeBase[trigger]) global.knowledgeBase[trigger] = [];
        if (!global.knowledgeBase[trigger].some(r => r.toLowerCase() === response.toLowerCase())) {
            global.knowledgeBase[trigger].push(response);
            this.saveKnowledgeBase(global.knowledgeBase);
            return true;
        }
        return false;
    }

    removeKBReply(trigger, response) {
        if (!global.knowledgeBase[trigger]) return false;
        const idx = global.knowledgeBase[trigger].findIndex(r => r.toLowerCase() === response.toLowerCase());
        if (idx === -1) return false;
        global.knowledgeBase[trigger].splice(idx, 1);
        if (global.knowledgeBase[trigger].length === 0) {
            delete global.knowledgeBase[trigger];
        }
        this.saveKnowledgeBase(global.knowledgeBase);
        return true;
    }

    getKBTriggers() {
        return Object.keys(global.knowledgeBase || {});
    }

    getKBReplies(trigger) {
        return global.knowledgeBase?.[trigger] ?? [];
    }

    // ─── Additional read helpers ──────────────────────────────────────────────

    getSubscribers() {
        return global.settingsOBJ?.subscribers ?? [];
    }

    getAllNewsChannels() {
        return global.settingsOBJ?.guildNews ?? {};
    }

    getAllRaffles() {
        return global.rafflesOBJ ?? {};
    }

    getGuildRaffles(guildId) {
        return global.rafflesOBJ?.[guildId] ?? null;
    }

    getOrCreateGuildRaffles(guildId) {
        if (!global.rafflesOBJ) global.rafflesOBJ = {};
        let isNew = false;
        if (!global.rafflesOBJ[guildId]) {
            global.rafflesOBJ[guildId] = {
                ongoingRaffles: [],
                allowedConcurrentRaffles: 1,
                allowedParticipants: 100,
                licensedUntil: Date.now() + 1 * 60 * 60 * 1000,
            };
            isNew = true;
        }
        return { data: global.rafflesOBJ[guildId], isNew };
    }

    getStaticLocale(lang, stringId) {
        return global.localesCache?.[lang]?.[stringId] ?? null;
    }

    getDynamicLocale(lang, stringId) {
        return global.dynamicLocales?.[lang]?.[stringId] ?? null;
    }

    getDynamicLocalesForLang(lang) {
        return global.dynamicLocales?.[lang] ?? {};
    }

    // ─── Rate-limit, Ban, & Blacklist High-Level Helpers ──────────────────────

    checkRateLimit(userId) {
        const now = Date.now();
        const lastTime = global.settingsOBJ?.ratelimit?.[userId] || 0;
        const isPatron = Boolean(global.settingsOBJ?.patrons?.[userId]);
        if (now - lastTime <= 250 && !isPatron) {
            const waitTime = ((250 - (now - lastTime)) / 1000).toFixed(1);
            return { ratelimited: true, waitTime };
        }
        if (!global.settingsOBJ.ratelimit) global.settingsOBJ.ratelimit = {};
        global.settingsOBJ.ratelimit[userId] = now;
        return { ratelimited: false, waitTime: "0" };
    }

    checkBan(userId, now = Date.now()) {
        const userBan = global.settingsOBJ?.banned?.[userId];
        if (!userBan) return null;
        const expired = !isNaN(userBan.until) && (userBan.until - now) <= 0;
        if (expired) {
            delete global.settingsOBJ.banned[userId];
            this.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
            return { active: false, expired: true };
        }
        return { active: true, expired: false, reason: userBan.reason, until: userBan.until };
    }

    isBlacklisted(guildId, commandOrContent) {
        const blacklist = global.settingsOBJ?.blacklist?.[guildId] || [];
        if (!Array.isArray(blacklist)) return false;
        if (typeof commandOrContent === 'string') {
            return blacklist.some(item => item.toLowerCase() === commandOrContent.toLowerCase());
        }
        return false;
    }

    // ─── Survey Helpers ────────────────────────────────────────────────────────

    findTakeableSurvey(userId) {
        const surveyRegistry = global.settingsOBJ?.surveys || {};
        const surveysAvailable = global.settingsOBJ?.surveysAvailable || {};
        const userSurveys = surveyRegistry[userId] || [];

        for (const [surveyId, surveyOBJ] of Object.entries(surveysAvailable)) {
            if (surveyOBJ.ended == null && !userSurveys.includes(surveyId)) {
                if (!surveyOBJ.yes.includes(userId) && !surveyOBJ.no.includes(userId)) {
                    return { surveyId, surveyOBJ };
                }
            }
        }
        return null;
    }

    // ─── Startup Validation ───────────────────────────────────────────────────

    ensureLoadedAndValid() {
        if (!global.settingsOBJ || !global.localesCache || !global.dynamicLocales || !global.knowledgeBase) {
            global.settingsOBJ = this.getKV('settings', 'kv', 'settingsOBJ') || {};
            global.localesCache = this.loadLocalesCache() || {};
            global.dynamicLocales = this.loadDynamicLocales() || {};
            global.knowledgeBase = this.loadKnowledgeBase() || {};
            global.rafflesOBJ = this.loadRaffles() || {};
        }

        const missingProps = [];
        const requiredKeys = [
            'banned', 'ignored', 'ratelimit', 'prefix', 'blacklist', 'logging',
            'lang', 'guildNews', 'subscribers', 'surveys', 'surveysAvailable',
            'AI', 'guildBump', 'patreonAdLastSeen', 'interactionsCounter',
            'patrons', 'shortcuts', 'nicknames', 'guildAdmins'
        ];

        for (const key of requiredKeys) {
            if (!global.settingsOBJ[key]) missingProps.push(`Missing settingsOBJ.${key}`);
        }

        if (missingProps.length > 0) {
            console.error(missingProps.join("\n"));
            return false;
        }
        return true;
    }

    checkpointAll() {
        for (const db of Object.values(this.databases)) {
            try {
                db.pragma('wal_checkpoint(TRUNCATE)');
                db.pragma('journal_mode = DELETE');
            } catch (e) { }
        }
        // Auto-remove any lingering sidecar journal files
        try {
            const rootDir = path.join(__dirname, '..');
            const files = fs.readdirSync(rootDir);
            for (const file of files) {
                if (file.endsWith('.db-wal') || file.endsWith('.db-shm')) {
                    try {
                        fs.unlinkSync(path.join(rootDir, file));
                    } catch { }
                }
            }
        } catch { }
    }

    closeAll() {
        for (const [name, db] of Object.entries(this.databases)) {
            try {
                db.close();
            } catch (e) { }
        }
        this.databases = {};
        this.initialized = false;
    }

    reconnectAll() {
        this.closeAll();
        this.init();
    }
}

const dbManager = new OugiDatabaseManager();

module.exports = function () {
    return dbManager;
};

module.exports.saveSettings = function () {
    if (global.settingsOBJ) {
        dbManager.saveKV('settings', 'kv', 'settingsOBJ', global.settingsOBJ);
    }
};

module.exports.saveRaffles = function () {
    if (global.rafflesOBJ) {
        dbManager.saveKV('raffles', 'kv', 'rafflesOBJ', global.rafflesOBJ);
    }
};

module.exports.saveKB = function () {
    if (global.knowledgeBase) {
        dbManager.saveKnowledgeBase(global.knowledgeBase);
    }
};
