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
        const member = await guild.members.fetch(TARGET_USER_ID);
        const vcChannel = member.voice?.channel;

        if (!vcChannel) {
            console.error(`[Error] User is not connected to voice channel.`);
            process.exit(1);
        }

        console.log(`[Voice Channel Found] "${vcChannel.name}"`);

        const mockMsg = {
            guild,
            guildId: guild.id,
            member,
            author: member.user,
            client,
            channel: {
                send: async (content) => {
                    const txt = typeof content === 'string' ? content : (content.embeds?.[0]?.data?.title || 'Embed');
                    console.log('[Channel Message]:', txt);
                }
            },
            content: 'ougi play https://www.youtube.com/watch?v=2hiKeIUJtos',
            react: async (emoji) => console.log(`[Message Reacted]: ${emoji}`)
        };

        console.log('\n--- Step 1: Starting Cached Song Playback ---');
        await ougi.voiceCallMusic(mockMsg);

        console.log('Listening to cached playback for 5 seconds...');
        await new Promise(r => setTimeout(r, 5000));

        console.log('\n--- Step 2: Triggering Concurrent TTS over Cached Song ---');
        const ttsUrls = googleTTS.getAllAudioUrls("Esta es una prueba de voz concurrente sobre una canción reproduciéndose desde el caché en disco. La música debe atenuarse suavemente y la voz debe sonar clara.", {
            lang: 'es',
            slow: false,
            host: 'https://translate.google.com'
        });

        console.log('Speaking TTS over cached music...');
        await ougi.voiceManager.playTts(mockMsg, vcChannel, ttsUrls);
        console.log('[Step 2 Complete] TTS finished speaking!');

        console.log('Listening to cached song at 100% volume for 10 more seconds...');
        await new Promise(r => setTimeout(r, 10000));

        console.log('\n--- Step 3: Testing Skip on Playing Track (Testing SIGTERM handling) ---');
        mockMsg.content = 'ougi play https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        await ougi.voiceCallMusic(mockMsg);

        console.log('Skipping current track to verify no ChildProcessError...');
        mockMsg.content = 'ougi skip';
        await ougi.voiceCallMusic(mockMsg);

        console.log('Listening to skipped track for 8 seconds...');
        await new Promise(r => setTimeout(r, 8000));

        console.log('\n--- Step 4: Stopping Playback ---');
        mockMsg.content = 'ougi stop';
        await ougi.voiceCallMusic(mockMsg);
        console.log('[Step 4 Complete] Playback stopped cleanly.');

        console.log('\n🎉 ALL CONCURRENCY AND SKIP TESTS COMPLETED!');
        process.exit(0);

    } catch (err) {
        console.error('[Test Error]:', err);
        process.exit(1);
    }
});

client.login(process.env.TOKEN).catch(console.error);
