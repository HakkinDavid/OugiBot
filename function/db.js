const Database = require('better-sqlite3');
const path = require('node:path');
const fs = require('fs');

class OugiDatabaseManager {
    constructor() {
        this.databases = {};
        this.init();
    }

    getDb(name) {
        if (!this.databases[name]) {
            const dbPath = path.join(__dirname, '..', `${name}.db`);
            const db = new Database(dbPath);
            db.pragma('journal_mode = WAL');
            this.databases[name] = db;
        }
        return this.databases[name];
    }

    init() {
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

        // 6. Raffles Table
        const rafflesDb = this.getDb('raffles');
        rafflesDb.exec(`
            CREATE TABLE IF NOT EXISTS raffles (
                guild_id TEXT PRIMARY KEY,
                data TEXT
            );
        `);

        // 7. Economy Table
        const economyDb = this.getDb('economy');
        economyDb.exec(`
            CREATE TABLE IF NOT EXISTS guild_economy (
                guild_id TEXT PRIMARY KEY,
                config TEXT
            );
            CREATE TABLE IF NOT EXISTS user_economy (
                guild_id TEXT,
                user_id TEXT,
                money INTEGER DEFAULT 0,
                xp INTEGER DEFAULT 0,
                level INTEGER DEFAULT 0,
                worked INTEGER DEFAULT 0,
                last_work INTEGER DEFAULT 0,
                last_daily INTEGER DEFAULT 0,
                inventory TEXT DEFAULT '[]',
                badges TEXT DEFAULT '[]',
                PRIMARY KEY (guild_id, user_id)
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
    }

    // KV Save / Load for Settings
    saveKV(dbName, tableName, key, value) {
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
}

const dbManager = new OugiDatabaseManager();

module.exports = function () {
    return dbManager;
};
