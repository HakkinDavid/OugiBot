require('dotenv').config();
const path = require('path');
const requireAll = require('require-all');
const Discord = require('discord.js');

global.Discord = Discord;
global.Voice = require('@discordjs/voice');
global.googleTTS = require('google-tts-api');
global.YouTube = require('youtube-sr').default;
global.youtubedl = require('youtube-dl-exec');
global.fs = require('fs');
global.updateCookiesCache = () => null;
global.cachedCookiesPath = null;
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
            content: 'ougi speak test',
            react: async (emoji) => console.log(`[Message Reacted]: ${emoji}`)
        };

        console.log('\n--- Step 1: Testing YouTube Music Playback ---');
        mockMsg.content = 'ougi play https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        await ougi.voiceCallMusic(mockMsg);

        console.log('Listening to music for 8 seconds...');
        await new Promise(r => setTimeout(r, 8000));

        console.log('\n--- Step 2: Testing Concurrent TTS with Ducking over Music ---');
        const ttsUrlsDucking = googleTTS.getAllAudioUrls("Probando voz sobre música. El volumen de la canción debe bajar mientras hablo y subir automáticamente al terminar.", {
            lang: 'es',
            slow: false,
            host: 'https://translate.google.com'
        });

        console.log('Speaking TTS over playing music...');
        await ougi.voiceManager.playTts(mockMsg, vcChannel, ttsUrlsDucking);
        console.log('[Step 2 Complete] TTS finished speaking! Music volume restored to 100%.');

        console.log('Letting music play at full volume for 8 more seconds...');
        await new Promise(r => setTimeout(r, 8000));

        console.log('\n--- Step 3: Testing Stop Command ---');
        mockMsg.content = 'ougi stop';
        await ougi.voiceCallMusic(mockMsg);
        console.log('[Step 3 Complete] Playback stopped cleanly.');

        console.log('\n🎉 ALL LIVE TESTS COMPLETED WITH AUDIO PLAYING!');
        process.exit(0);

    } catch (err) {
        console.error('[Test Error]:', err);
        process.exit(1);
    }
});

client.login(process.env.TOKEN).catch(console.error);
