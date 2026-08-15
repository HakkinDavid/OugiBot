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

        console.log('\n--- Action 1: Play short song and wait for it to FULLY finish ---');
        await ougi.voiceCallMusic(mockMsg);

        console.log('Waiting 25 seconds for song to completely finish and player to go idle...');
        await new Promise(r => setTimeout(r, 25000));

        const session = vc[guild.id];
        console.log('Session state after song 1 finished:', {
            queueLength: session?.queue?.length,
            isMusicActive: session?.mixer?.isMusicActive,
            mixerEnded: session?.mixer?.ended,
            playerStatus: session?.player?.state?.status,
            encoderKilled: session?.encoder?.killed
        });

        console.log('\n--- Action 2: Now request TTS after song has finished ---');
        const ttsUrls = googleTTS.getAllAudioUrls("Probando si el bot habla después de que la canción terminó completamente.", {
            lang: 'es',
            slow: false,
            host: 'https://translate.google.com'
        });

        console.log('Triggering TTS now...');
        await ougi.voiceManager.playTts(mockMsg, vcChannel, ttsUrls);
        console.log('[Action 2 Complete] TTS finished!');

        console.log('\nWaiting 5 seconds...');
        await new Promise(r => setTimeout(r, 5000));

        console.log('\n--- Action 3: Now request a NEW song after TTS finished ---');
        mockMsg.content = 'ougi play https://www.youtube.com/watch?v=2hiKeIUJtos';
        await ougi.voiceCallMusic(mockMsg);

        console.log('Listening to song 2 for 15 seconds...');
        await new Promise(r => setTimeout(r, 15000));

        console.log('\n--- Action 4: Stopping Playback ---');
        mockMsg.content = 'ougi stop';
        await ougi.voiceCallMusic(mockMsg);
        console.log('[Action 4 Complete] Done!');

        process.exit(0);

    } catch (err) {
        console.error('[Test Error]:', err);
        process.exit(1);
    }
});

client.login(process.env.TOKEN).catch(console.error);
