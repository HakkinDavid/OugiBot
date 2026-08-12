require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const https = require('https');
const dbManager = require('./function/db')();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const channels = {
    backup: "726927738094485534",
    embeds: "740187317238497340",
    news: "751697345737129994",
    settings: "791151086077083688",
    locales: "820971831992647681",
    dynamicLocales: "880322518139957299",
    raffles: "1411177261172002906",
    economy: "1536866624253075527"
};

const databaseMapping = [
    { key: 'settings', channelId: channels.settings, txtFile: './settings.txt', dbFile: './settings.db' },
    { key: 'backup', channelId: channels.backup, txtFile: './responses.txt', dbFile: './responses.db' },
    { key: 'embeds', channelId: channels.embeds, txtFile: './embedPresets.txt', dbFile: './embedPresets.db' },
    { key: 'news', channelId: channels.news, txtFile: './newsChannel.txt', dbFile: './newsChannel.db' },
    { key: 'locales', channelId: channels.locales, txtFile: './localesCache.txt', dbFile: './localesCache.db' },
    { key: 'dynamicLocales', channelId: channels.dynamicLocales, txtFile: './dynamicLocales.txt', dbFile: './dynamicLocales.db' },
    { key: 'raffles', channelId: channels.raffles, txtFile: './raffles.txt', dbFile: './raffles.db' },
    { key: 'economy', channelId: channels.economy, txtFile: null, dbFile: './economy.db' }
];

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                return reject(new Error(`Failed to download ${url}: Status ${response.statusCode}`));
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

function isSqliteHeader(filepath) {
    if (!fs.existsSync(filepath)) return false;
    try {
        const fd = fs.openSync(filepath, 'r');
        const buffer = Buffer.alloc(16);
        fs.readSync(fd, buffer, 0, 16, 0);
        fs.closeSync(fd);
        return buffer.toString('utf-8', 0, 15) === "SQLite format 3";
    } catch {
        return false;
    }
}

client.once('ready', async () => {
    console.log("==========================================");
    console.log(`🌐 Logged in as ${client.user.tag}`);
    console.log("🚀 Starting Production Data Sync & SQLite Migration Pipeline");
    console.log("==========================================");

    // STEP 1: PULL & DOWNLOAD BEST PRODUCTION ATTACHMENTS (Skipping 4KB empty placeholders)
    console.log("\n📥 STEP 1: Locating & Downloading best production attachments from Discord...");
    for (const item of databaseMapping) {
        try {
            const channel = await client.channels.fetch(item.channelId).catch(() => null);
            if (!channel) {
                console.log(`  ⚠️ Channel ${item.channelId} inaccessible for ${item.key}`);
                continue;
            }

            const messages = await channel.messages.fetch({ limit: 100 });
            let bestAttachment = null;

            for (const msg of messages.values()) {
                if (msg.attachments.size > 0) {
                    for (const att of msg.attachments.values()) {
                        // Ignore empty 4KB database placeholders if larger backup exists
                        if (!bestAttachment || att.size > bestAttachment.size) {
                            bestAttachment = { url: att.url, size: att.size, name: att.name, msgId: msg.id };
                        }
                    }
                }
            }

            if (bestAttachment) {
                const tempDownload = `./temp_${item.key}_download`;
                console.log(`  ⬇️ Found best attachment (${(bestAttachment.size / 1024).toFixed(1)} KB) in message ${bestAttachment.msgId}...`);
                await downloadFile(bestAttachment.url, tempDownload);

                if (isSqliteHeader(tempDownload) && bestAttachment.size > 4096) {
                    console.log(`  💾 Attachment for ${item.key} is a populated SQLite .db file (${bestAttachment.size} bytes).`);
                    fs.copyFileSync(tempDownload, item.dbFile);
                    fs.unlinkSync(tempDownload);
                } else {
                    console.log(`  📄 Attachment for ${item.key} is a legacy text/encrypted data file.`);
                    if (item.txtFile) {
                        fs.copyFileSync(tempDownload, item.txtFile);
                    }
                    fs.unlinkSync(tempDownload);
                }
            } else {
                console.log(`  ⚠️ No valid attachments found in channel ${item.channelId} for ${item.key}`);
            }
        } catch (err) {
            console.error(`  ❌ Error pulling ${item.key}:`, err.message);
        }
    }

    // STEP 2: MIGRATE LEGACY .TXT DATA INTO SQLITE DATABASES
    console.log("\n⚙️ STEP 2: Executing Migration for downloaded legacy text files...");
    try {
        require('./migrateToSqlite');
        console.log("  ✅ Migration complete!");
    } catch (err) {
        console.error("  ❌ Migration error:", err);
    }

    // STEP 3: UPLOAD POPULATED SQLITE DBs BACK TO DISCORD BACKUP CHANNELS
    console.log("\n📤 STEP 3: Checkpointing WAL journals & Uploading populated SQLite (.db) database files back to Discord...");
    dbManager.checkpointAll();
    for (const item of databaseMapping) {
        if (!fs.existsSync(item.dbFile)) {
            console.log(`  ⚠️ File ${item.dbFile} does not exist locally, skipping upload.`);
            continue;
        }

        const fileSize = fs.statSync(item.dbFile).size;
        console.log(`  📊 Database ${item.dbFile}: ${fileSize} bytes.`);

        try {
            const channel = await client.channels.fetch(item.channelId).catch(() => null);
            if (!channel) {
                console.log(`  ❌ Inaccessible backup channel ${item.channelId} for ${item.dbFile}`);
                continue;
            }

            console.log(`  📤 Uploading ${item.dbFile} (${(fileSize / 1024).toFixed(1)} KB) to channel ${item.channelId}...`);
            await channel.send({
                content: `🗄️ **OugiBot SQLite Database Backup (${item.dbFile})** — ${new Date().toISOString()} (${(fileSize / 1024).toFixed(1)} KB)`,
                files: [item.dbFile]
            });
            console.log(`  ✅ Successfully uploaded ${item.dbFile}`);
        } catch (err) {
            console.error(`  ❌ Error uploading ${item.dbFile}:`, err.message);
        }
    }

    // STEP 4: CLEAN UP TEMPORARY .TXT FILES
    console.log("\n🧹 STEP 4: Cleaning up temporary legacy text files...");
    for (const item of databaseMapping) {
        if (item.txtFile && fs.existsSync(item.txtFile)) {
            try {
                fs.unlinkSync(item.txtFile);
                console.log(`  🗑️ Deleted temporary text file: ${item.txtFile}`);
            } catch (err) {
                console.error(`  ❌ Failed to delete ${item.txtFile}:`, err.message);
            }
        }
    }

    console.log("\n==========================================");
    console.log("✨ Sync-Migrate-Upload Pipeline Finished Successfully!");
    console.log("==========================================");

    client.destroy();
    process.exit(0);
});

if (!process.env.TOKEN) {
    console.error("❌ TOKEN environment variable is missing in .env file.");
    process.exit(1);
}

client.login(process.env.TOKEN);
