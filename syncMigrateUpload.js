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

// Legacy input text files vs SQLite target output DB files
const legacyFiles = {
    settings: { id: channels.settings, file: './settings.txt' },
    backup: { id: channels.backup, file: './responses.txt' },
    embeds: { id: channels.embeds, file: './embedPresets.txt' },
    news: { id: channels.news, file: './newsChannel.txt' },
    locales: { id: channels.locales, file: './localesCache.txt' },
    dynamicLocales: { id: channels.dynamicLocales, file: './dynamicLocales.txt' },
    raffles: { id: channels.raffles, file: './raffles.txt' }
};

const sqliteDbFiles = {
    settings: { id: channels.settings, file: './settings.db' },
    backup: { id: channels.backup, file: './responses.db' },
    embeds: { id: channels.embeds, file: './embedPresets.db' },
    news: { id: channels.news, file: './newsChannel.db' },
    locales: { id: channels.locales, file: './localesCache.db' },
    dynamicLocales: { id: channels.dynamicLocales, file: './dynamicLocales.db' },
    raffles: { id: channels.raffles, file: './raffles.db' },
    economy: { id: channels.economy, file: './economy.db' }
};

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

client.once('ready', async () => {
    console.log("==========================================");
    console.log(`🌐 Logged in as ${client.user.tag}`);
    console.log("🚀 Starting End-to-End Pipeline: PRE-CLEANUP -> PULL -> MIGRATE -> UPLOAD SQLITE DBs -> POST-CLEANUP");
    console.log("==========================================");

    // STEP 0: PRE-CLEANUP LOCAL FLAT FILES
    console.log("\n🧹 STEP 0: Cleaning up pre-existing local flat files...");
    for (const [key, data] of Object.entries(legacyFiles)) {
        if (fs.existsSync(data.file)) {
            try {
                fs.unlinkSync(data.file);
                console.log(`  🗑️ Deleted pre-existing local file: ${data.file}`);
            } catch (err) {
                console.error(`  ❌ Error deleting ${data.file}:`, err.message);
            }
        }
    }

    // STEP 1: PULL & DOWNLOAD PRODUCTION CHANNEL DATA
    console.log("\n📥 STEP 1: Pulling fresh production data from Discord channels...");
    for (const [key, data] of Object.entries(legacyFiles)) {
        try {
            const channel = await client.channels.fetch(data.id).catch(() => null);
            if (!channel) {
                console.log(`  ⚠️ Skipping channel ${data.id} for ${data.file} (Channel inaccessible)`);
                continue;
            }

            const messages = await channel.messages.fetch({ limit: 5 });
            const lastMsg = messages.find(m => m.attachments && m.attachments.size > 0);

            if (lastMsg && lastMsg.attachments.size > 0) {
                const attachmentUrl = lastMsg.attachments.first().url;
                console.log(`  ⬇️ Downloading ${data.file} from message ${lastMsg.id}...`);
                await downloadFile(attachmentUrl, data.file);
                console.log(`  ✅ Downloaded fresh ${data.file}`);
            } else {
                console.log(`  ⚠️ No message with attachments found in channel ${data.id}`);
            }
        } catch (err) {
            console.error(`  ❌ Error pulling ${data.file}:`, err.message);
        }
    }

    // STEP 2: MIGRATE TO SQLITE
    console.log("\n⚙️ STEP 2: Executing Migration to SQLite Databases...");
    try {
        require('./migrateToSqlite');
        console.log("  ✅ Migration to SQLite complete!");
    } catch (err) {
        console.error("  ❌ Migration failed:", err);
    }

    // STEP 3: UPLOAD ACTUAL SQLITE .DB FILES BACK TO CHANNELS
    console.log("\n📤 STEP 3: Uploading Fresh SQLite (.db) Files back to Production Discord Channels...");
    for (const [key, data] of Object.entries(sqliteDbFiles)) {
        if (!fs.existsSync(data.file)) {
            console.log(`  ⚠️ Skipping upload for ${data.file} (File not found locally)`);
            continue;
        }

        try {
            const channel = await client.channels.fetch(data.id).catch(() => null);
            if (!channel) {
                console.log(`  ❌ Inaccessible backup channel ${data.id} for ${data.file}`);
                continue;
            }

            console.log(`  📤 Uploading SQLite Database ${data.file} to channel ${data.id}...`);
            await channel.send({
                content: `🗄️ **OugiBot SQLite Database Backup (${data.file})** — ${new Date().toISOString()}`,
                files: [data.file]
            });
            console.log(`  ✅ Uploaded SQLite database ${data.file}`);
        } catch (err) {
            console.error(`  ❌ Error uploading ${data.file}:`, err.message);
        }
    }

    // STEP 4: POST-CLEANUP LOCAL FLAT FILES
    console.log("\n🧹 STEP 4: Cleaning up local legacy flat text files...");
    for (const [key, data] of Object.entries(legacyFiles)) {
        if (fs.existsSync(data.file)) {
            try {
                fs.unlinkSync(data.file);
                console.log(`  🗑️ Deleted local legacy copy: ${data.file}`);
            } catch (err) {
                console.error(`  ❌ Failed to delete ${data.file}:`, err.message);
            }
        }
    }

    console.log("\n==========================================");
    console.log("✨ Complete Pipeline (PRE-CLEANUP -> PULL -> MIGRATE -> UPLOAD SQLITE DBs -> POST-CLEANUP) Finished!");
    console.log("==========================================");

    client.destroy();
    process.exit(0);
});

if (!process.env.TOKEN) {
    console.error("❌ TOKEN environment variable is missing in .env file.");
    process.exit(1);
}

client.login(process.env.TOKEN);
