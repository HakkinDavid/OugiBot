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
            
            // Check if existing file is not a valid SQLite database (e.g., text JSON)
            if (fs.existsSync(dbPath)) {
                try {
                    const fd = fs.openSync(dbPath, 'r');
                    const buffer = Buffer.alloc(16);
                    fs.readSync(fd, buffer, 0, 16, 0);
                    fs.closeSync(fd);
                    const header = buffer.toString('utf-8', 0, 15);
                    if (header !== "SQLite format 3") {
                        console.warn(`[DB] File ${name}.db is not SQLite format (found text content). Recreating database...`);
                        fs.unlinkSync(dbPath);
                    }
                } catch (err) {
                    console.warn(`[DB] Error inspecting ${name}.db:`, err);
                }
            }

            try {
                const db = new Database(dbPath);
                db.pragma('journal_mode = WAL');
                this.databases[name] = db;
            } catch (err) {
                console.error(`[DB] Failed to open ${name}.db, attempting corruption repair:`, err);
                if (fs.existsSync(dbPath)) try { fs.unlinkSync(dbPath); } catch {}
                const db = new Database(dbPath);
                db.pragma('journal_mode = WAL');
                this.databases[name] = db;
            }
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

    loadRaffles() {
        const db = this.getDb('raffles');
        const rows = db.prepare('SELECT guild_id, data FROM raffles').all();
        if (rows.length === 0) return null;
        const raffles = {};
        for (const row of rows) {
            try {
                raffles[row.guild_id] = JSON.parse(row.data);
            } catch {}
        }
        return raffles;
    }

    loadEmbedPresets() {
        const db = this.getDb('embedPresets');
        const rows = db.prepare('SELECT preset_key, data FROM presets').all();
        const presets = {};
        for (const row of rows) {
            try {
                presets[row.preset_key] = JSON.parse(row.data);
            } catch {}
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
}

const dbManager = new OugiDatabaseManager();

module.exports = function () {
    return dbManager;
};
