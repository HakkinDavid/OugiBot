require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const CryptoJS = require('crypto-js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

global.client = client;
global.ougi = {
    backup: require('./function/backup'),
    writeFile: require('./function/writeFile')
};

const channels = {
    backup: "726927738094485534",
    embeds: "740187317238497340",
    news: "751697345737129994",
    settings: "791151086077083688",
    locales: "820971831992647681",
    dynamicLocales: "880322518139957299",
    raffles: "1411177261172002906"
};

const database = {
    settings: { id: channels.settings, file: './settings.txt' },
    backup: { id: channels.backup, file: './responses.txt' },
    embeds: { id: channels.embeds, file: './embedPresets.txt' },
    news: { id: channels.news, file: './newsChannel.txt' },
    locales: { id: channels.locales, file: './localesCache.txt' },
    dynamicLocales: { id: channels.dynamicLocales, file: './dynamicLocales.txt' },
    raffles: { id: channels.raffles, file: './raffles.txt' }
};

client.once('ready', async () => {
    console.log("==========================================");
    console.log(`🌐 Logged in as ${client.user.tag}`);
    console.log("🚀 Starting Cloud Upload to Discord Backup Channels");
    console.log("==========================================");

    for (const [key, data] of Object.entries(database)) {
        if (!fs.existsSync(data.file)) {
            console.log(`⚠️ File ${data.file} does not exist locally, skipping upload.`);
            continue;
        }

        const channel = client.channels.cache.get(data.id);
        if (!channel) {
            console.log(`❌ Could not resolve backup channel ID ${data.id} for ${data.file}`);
            continue;
        }

        try {
            console.log(`📤 Uploading ${data.file} to Discord channel ${data.id}...`);
            await channel.send({ files: [data.file] });
            console.log(`  ✅ Successfully uploaded ${data.file}`);
        } catch (err) {
            console.error(`  ❌ Failed to upload ${data.file}:`, err);
        }
    }

    console.log("\n==========================================");
    console.log("✨ All Backups Uploaded to Production Channels!");
    console.log("==========================================");

    client.destroy();
    process.exit(0);
});

if (!process.env.TOKEN) {
    console.error("❌ TOKEN environment variable is missing in .env file.");
    process.exit(1);
}

client.login(process.env.TOKEN);
