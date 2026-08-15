require('dotenv').config();
const path = require('path');
const requireAll = require('require-all');
const Discord = require('discord.js');

global.Discord = Discord;
global.Voice = require('@discordjs/voice');
global.googleTTS = require('google-tts-api');
global.YouTube = require('youtube-sr').default;
global.fs = require('fs');
global.youtubedl = require('youtube-dl-exec');
global.sanitizeCookiesFile = function(filePath) {
    if (!filePath || !global.fs.existsSync(filePath)) return null;
    const sanitizedPath = filePath + '.clean';
    return global.fs.existsSync(sanitizedPath) ? sanitizedPath : filePath;
};
global.updateCookiesCache = function() {
    const defaultPath = path.join(__dirname, '../cookies.txt');
    if (global.fs.existsSync(defaultPath)) return global.sanitizeCookiesFile(defaultPath);
    return null;
};
global.cachedCookiesPath = global.updateCookiesCache();
global.vc = {};

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.MessageContent
    ]
});

global.client = client;
global.ougi = requireAll(path.join(__dirname, '../function'));

const TARGET_GUILD_ID = '667663787129569282';
const TARGET_USER_ID = '265257341967007758';

client.on('ready', async () => {
    console.log(`[Bot Ready] Logged in as ${client.user.tag}`);
    console.log(`[Cookies Loaded]:`, global.cachedCookiesPath);

    try {
        const guild = await client.guilds.fetch(TARGET_GUILD_ID);
        if (!guild) {
            console.error(`Guild ${TARGET_GUILD_ID} not found.`);
            process.exit(1);
        }
        console.log(`[Guild Found] ${guild.name} (${guild.id})`);

        const member = await guild.members.fetch(TARGET_USER_ID);
        if (!member) {
            console.error(`Member ${TARGET_USER_ID} not found in guild.`);
            process.exit(1);
        }
        console.log(`[Member Found] ${member.user.tag}`);

        const vcChannel = member.voice?.channel;
        if (!vcChannel) {
            console.error(`[Error] User ${member.user.tag} is not currently connected to any voice channel in ${guild.name}. Please join a voice channel and run again.`);
            return;
        }

        console.log(`[Voice Channel Found] "${vcChannel.name}" (ID: ${vcChannel.id})`);

        const mockMsg = {
            guild,
            guildId: guild.id,
            member,
            author: member.user,
            client,
            channel: {
                send: async (content) => {
                    const txt = typeof content === 'string' ? content : (content.embeds?.[0]?.data?.title || content.embeds?.[0]?.data?.description || 'Embed');
                    console.log('[Channel Message]:', txt);
                }
            },
            content: 'ougi play https://www.youtube.com/watch?v=2hiKeIUJtos',
            react: async (emoji) => console.log(`[Message Reacted]: ${emoji}`)
        };

        console.log('\n--- Step 1: Starting Song 1 (Short Track) ---');
        await ougi.voiceCallMusic(mockMsg);

        console.log('\n--- Step 2: Enqueuing Song 2 into Queue (Triggering Background Prefetch) ---');
        mockMsg.content = 'ougi play https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        await ougi.voiceCallMusic(mockMsg);

        console.log('Listening to Song 1 for 15 seconds while Song 2 prefetches in background...');
        await new Promise(r => setTimeout(r, 15000));

        console.log('\n--- Step 3: Checking Queue Status ---');
        mockMsg.content = 'ougi queue';
        await ougi.voiceCallMusic(mockMsg);

        console.log('\n--- Step 4: Skipping to Song 2 (Seamless Instant Playback from Cache) ---');
        mockMsg.content = 'ougi skip';
        await ougi.voiceCallMusic(mockMsg);

        console.log('Listening to Song 2 for 15 seconds...');
        await new Promise(r => setTimeout(r, 15000));

        console.log('\n--- Step 5: Stopping Playback ---');
        mockMsg.content = 'ougi stop';
        await ougi.voiceCallMusic(mockMsg);
        console.log('[Step 5 Complete] Playback stopped cleanly.');

        console.log('\n🎉 ALL AUDIO CACHE & PREFETCH LIVE TESTS COMPLETED!');
        process.exit(0);

    } catch (err) {
        console.error('[Test Error]:', err);
        process.exit(1);
    }
});

client.login(process.env.TOKEN).catch(console.error);
