require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dbManager = require('./function/db')();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const backupChannels = {
    settings: "791151086077083688",
    backup: "726927738094485534",
    embeds: "740187317238497340",
    news: "751697345737129994",
    locales: "820971831992647681",
    dynamicLocales: "880322518139957299",
    raffles: "1411177261172002906",
    economy: "1536866624253075527"
};

const databaseMapping = [
    { key: 'settings', channelId: backupChannels.settings, dbFile: './settings.db' },
    { key: 'responses', channelId: backupChannels.backup, dbFile: './responses.db' },
    { key: 'embedPresets', channelId: backupChannels.embeds, dbFile: './embedPresets.db' },
    { key: 'newsChannel', channelId: backupChannels.news, dbFile: './newsChannel.db' },
    { key: 'localesCache', channelId: backupChannels.locales, dbFile: './localesCache.db' },
    { key: 'dynamicLocales', channelId: backupChannels.dynamicLocales, dbFile: './dynamicLocales.db' },
    { key: 'raffles', channelId: backupChannels.raffles, dbFile: './raffles.db' },
    { key: 'economy', channelId: backupChannels.economy, dbFile: './economy.db' }
];

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
    console.log("🚀 Starting Unified Self-Contained Database Upload");
    console.log("==========================================");

    // STEP 1: FLUSH WAL TRANSACTIONS, ENFORCE JOURNAL_MODE = DELETE & REMOVE SIDECARS
    console.log("\n🧹 STEP 1: Enforcing journal_mode = DELETE & removing sidecars...");
    dbManager.checkpointAll();
    console.log("  ✅ All databases converted to single-file journal_mode = DELETE.");

    // STEP 2: UPLOAD POPULATED SINGLE-FILE SQLITE DATABASES TO DISCORD
    console.log("\n📤 STEP 2: Uploading self-contained SQLite (.db) database files to Discord...");
    let successCount = 0;
    let skipCount = 0;

    for (const item of databaseMapping) {
        if (!fs.existsSync(item.dbFile)) {
            console.log(`  ⚠️ Database file ${item.dbFile} does not exist locally, skipping.`);
            skipCount++;
            continue;
        }

        if (!isSqliteHeader(item.dbFile)) {
            console.log(`  ❌ File ${item.dbFile} is not a valid SQLite database, skipping.`);
            skipCount++;
            continue;
        }

        const fileSize = fs.statSync(item.dbFile).size;
        if (fileSize <= 4096) {
            console.log(`  ⚠️ Database ${item.dbFile} is an empty 4KB header (${fileSize} bytes), skipping upload to prevent overwriting production.`);
            skipCount++;
            continue;
        }

        const sizeStr = fileSize >= 1024 * 1024 
            ? `${(fileSize / (1024 * 1024)).toFixed(2)} MB`
            : `${(fileSize / 1024).toFixed(1)} KB`;

        try {
            const channel = await client.channels.fetch(item.channelId).catch(() => null);
            if (!channel) {
                console.log(`  ❌ Inaccessible backup channel ${item.channelId} for ${item.dbFile}`);
                skipCount++;
                continue;
            }

            console.log(`  📤 Uploading ${item.dbFile} (${sizeStr}) to channel ${item.channelId}...`);
            await channel.send({
                content: `🗄️ **OugiBot Self-Contained SQLite Backup (${item.dbFile})** — ${new Date().toISOString()} (${sizeStr})`,
                files: [item.dbFile]
            });
            console.log(`  ✅ Successfully uploaded ${item.dbFile}`);
            successCount++;
        } catch (err) {
            console.error(`  ❌ Error uploading ${item.dbFile}:`, err.message);
            skipCount++;
        }
    }

    console.log("\n==========================================");
    console.log(`✨ Unified Backup Upload Finished! (${successCount} uploaded, ${skipCount} skipped)`);
    console.log("==========================================");

    client.destroy();
    process.exit(0);
});

if (!process.env.TOKEN) {
    console.error("❌ TOKEN environment variable is missing in .env file.");
    process.exit(1);
}

client.login(process.env.TOKEN);
