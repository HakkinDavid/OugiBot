/* Shokkamonogatari - Discord.js v14.21.0 Refactor */

require('dotenv').config();
global.Discord = require('discord.js')
global.fs = require('fs');
global.request = require('request');
global.requireAll = require('require-all');
global.download = require('download-file');
global.Twit = require('twit');
global.translate = require('@vitalets/google-translate-api');
global.randomCase = require('random-case');
global.findRemoveSync = require('find-remove');
global.stringSimilarity = require('string-similarity');
global.levenary = require('levenary').default;
global.leven = require('leven');
global.isHexcolor = require('is-hexcolor');
global.isImageUrl = require('is-image-url');
global.scrapeYt = require('scrape-yt');
global.KSoftClient = require('@ksoft/api').KSoftClient;
global.removeWords = require('remove-words');
global.NewsAPI = require('newsapi');
global.gis = require('async-g-i-s');
global.CryptoJS = require('crypto-js');
global.exec = require('child_process').exec;
global.Voice = require('@discordjs/voice');
global.path = require('node:path');
global.colors = require('@colors/colors/safe');
global.googleTTS = require('google-tts-api');
global.YouTube = require('youtube-sr').default;
global.youtubedl = require('youtube-dl-exec');

global.sanitizeCookiesFile = function(filePath) {
    if (!filePath || !fs.existsSync(filePath)) return null;
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split(/\r?\n/);
        const cleanLines = [
            '# Netscape HTTP Cookie File',
            '# https://curl.haxx.se/rfc/cookie_spec.html',
            '# This is a sanitized cookie file for yt-dlp',
            ''
        ];

        for (let line of lines) {
            line = line.trim();
            if (!line || line.startsWith('#')) continue;

            const parts = line.split('\t');
            if (parts.length >= 6) {
                let domain = parts[0];
                let sub = domain.startsWith('.') ? 'TRUE' : (parts[1] ? parts[1].toUpperCase() : 'FALSE');
                if (domain.startsWith('.')) sub = 'TRUE';

                const cookiePath = parts[2] || '/';
                const secure = parts[3] ? parts[3].toUpperCase() : 'FALSE';
                const expires = parts[4] || '0';
                const name = parts[5];
                const value = parts[6] || '';

                if (name) {
                    cleanLines.push(`${domain}\t${sub}\t${cookiePath}\t${secure}\t${expires}\t${name}\t${value}`);
                }
            }
        }

        const sanitizedPath = filePath + '.clean';
        fs.writeFileSync(sanitizedPath, cleanLines.join('\n'), 'utf-8');
        return sanitizedPath;
    } catch (e) {
        console.error("Error sanitizing cookies file:", e);
        return filePath;
    }
};

global.updateCookiesCache = function() {
    const envPath = process.env.YOUTUBE_COOKIES_FILE;
    if (envPath && fs.existsSync(envPath)) return global.sanitizeCookiesFile(envPath);
    const defaultPath = path.join(__dirname, 'cookies.txt');
    if (fs.existsSync(defaultPath)) return global.sanitizeCookiesFile(defaultPath);
    return null;
};
global.cachedCookiesPath = global.updateCookiesCache();


try {
    findRemoveSync('./', { extensions: ['.txt', '.db', '.db-wal', '.db-shm', '.mp3'] });
}
catch (e) {
    console.error(e);
}

/* ===== Cliente ===== */
global.client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.GuildBans,
        Discord.GatewayIntentBits.GuildModeration,
        Discord.GatewayIntentBits.GuildWebhooks,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildScheduledEvents,
        Discord.GatewayIntentBits.AutoModerationConfiguration,
        Discord.GatewayIntentBits.AutoModerationExecution
    ],
    partials: [
        Discord.Partials.User,
        Discord.Partials.Channel,
        Discord.Partials.Message,
        Discord.Partials.GuildMember,
        Discord.Partials.Reaction,
        Discord.Partials.ThreadMember,
        Discord.Partials.GuildScheduledEvent
    ]
});

/* ===== Variables Globales ===== */
global.instanceID = Date.now().toString().slice(-4);
global.TEASEABLE = process.argv.slice(2)[0] !== 'silent';
global.davidUserID = "265257341967007758";
global.consoleLogging = "1140457399673688176";

global.ksoft = new KSoftClient(process.env.KSOFTTOKEN);
global.newsapi = new NewsAPI(process.env.NEWS);

global.T = new Twit({
    consumer_key: process.env.CKEY,
    consumer_secret: process.env.CSECRET,
    access_token: process.env.ACCTOKEN,
    access_token_secret: process.env.ACCTOKENSECRET,
    timeout_ms: 60_000,
    strictSSL: true
});

global.ougi = requireAll(path.join(__dirname, 'function'));

/* ===== Configuración de Canales ===== */
global.channels = {
    backup: "726927738094485534",
    fileSpace: "726929586339840072",
    reminders: "726929651573981225",
    embeds: "740187317238497340",
    news: "751697345737129994",
    neuro: "759983614128947250",
    settings: "791151086077083688",
    locales: "1538681641076007022",
    dynamicLocales: "880322518139957299",
    raffles: "1411177261172002906",
    economy: "1536866624253075527",
    cookies: "1537325636945846273"
};

ougi.db().unloadAll();

let logMessages = [];
global.errorBackup = console.error;

/* ===== Manejo de Errores ===== */
console.error = async (...args) => {
    logMessages.push(...args);
    if (!logMessages.at(-1)) return logMessages.pop();

    const criticalEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: await ougi.text({ lang: 'en', stringID: "log_consoleErrorAuthor" }) })
        .setColor("#c20d00")
        .setFooter({ text: await ougi.text({ lang: 'en', stringID: "log_errorEmbedFooter" }), iconURL: "https://github.com/HakkinDavid/OugiBot/blob/master/images/ougi.png?raw=true" })
        .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/fatal.png?raw=true")
        .setDescription(logMessages.pop().toString().slice(0, 4000));

    errorBackup.apply(console, args);
    client.channels.cache.get(consoleLogging)?.send({ embeds: [criticalEmbed] }).catch(errorBackup);
};

/* ===== Sincronización de Base de Datos ===== */
async function syncData() {
    global.isSyncing = true;
    try {
        for (const [key, data] of Object.entries(database)) {
            if (!data.done) await ougi.fetch(data.id, data.file, key);
        }
        await ougi.fetchAttachment(channels.cookies, "1537327306765504532", "cookies.txt").catch(() => {});
        global.cachedCookiesPath = global.updateCookiesCache();
    } finally {
        global.isSyncing = false;
    }
}


/* ===== Eventos del Cliente ===== */
client.once('ready', async () => {
    try {
        await syncData();
        ougi.db().initHashes();
        await client.application?.commands.set([
            {
                name: 'Translate',
                type: Discord.ApplicationCommandType.Message
            }
        ]).catch(console.error);
        const startupPayload = await ougi.text({
            lang: 'en',
            stringID: "log_instanceStartup",
            values: {
                id: instanceID,
                dev: process.env.DEV,
                silent: !TEASEABLE
            }
        });
        client.channels.cache.get(consoleLogging)?.send(startupPayload).catch(console.error);
        console.log(await ougi.text({ lang: 'en', stringID: "console_instanceId", values: { id: instanceID } }));
        ougi.startup();
    } catch (err) {
        console.error(await ougi.text({ lang: 'en', stringID: "console_startupError" }), err);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction) return;
    if (!TEASEABLE && interaction.user.id !== davidUserID) return;
    if (!ougi.startup()) return;
    if (ougi.db().isIgnored(interaction.user.id)) {
        if (interaction.isRepliable()) {
            await interaction.reply({ content: await ougi.text({ msg: interaction, stringID: "interaction_optedOut" }), flags: Discord.MessageFlags.Ephemeral }).catch(console.error);
        }
        return;
    }

    await ougi.processInteraction(interaction);
});

client.on('messageCreate', async (msg) => {
    if (!msg.author || msg.author.bot && msg.author.id !== '302050872383242240') return;

    if (!TEASEABLE && msg.author.id !== davidUserID) return;
    if (!TEASEABLE && msg.content.startsWith(`${instanceID}::`)) msg.content = msg.content.replace(`${instanceID}::`, '');

    if (!ougi.startup()) return;

    if (ougi.db().isIgnored(msg.author.id)) {
        if (msg.content === "I want to start using Ougi [BOT].") ougi.optback(msg);
        return;
    }

    if (msg.content.includes("@everyone")) return;

    let repliedToOugi = false;
    if (msg.reference) {
        try {
            const refMsg = await msg.channel.messages.fetch(msg.reference.messageId);
            repliedToOugi = refMsg.author.id === client.user.id;
        } catch { }
    }

    const prefixMatch = ougi.helperFunctions.checkForPrefixMsg(msg);
    let ourConcern = false;
    if (prefixMatch?.isTopLevel && !prefixMatch.isRoot) {
        await ougi.processCommand(msg);
        ourConcern = true;
    } else if (prefixMatch?.isRoot) {
        await ougi.rootCommands(msg);
        ourConcern = true;
    } else if (msg.channel.type === Discord.ChannelType.DM && msg.content.length > 0) {
        if (msg.content === "I want to opt out from using Ougi [BOT].") {
            const pseudoMSG = { ...msg, content: ougi.helperFunctions.prependPrefix("OPTOUTSTATEMENT") };
            ougi.globalLog(pseudoMSG);
            ougi.optout(msg);
        }
        else {
            ougi.genAIAbility(msg);
            ourConcern = true;
        }
    } else if (msg.channel.type === Discord.ChannelType.GuildText && msg.content.length > 0) {
        let isCommand = false;

        if (prefixMatch?.isCustom) {
            msg.content = ougi.helperFunctions.prependPrefixMsg(msg, prefixMatch.prefix);
            await ougi.processCommand(msg);
            ourConcern = true;
            isCommand = true;
        }

        if (!isCommand && repliedToOugi) { ougi.genAIAbility(msg, repliedToOugi); ourConcern = true; }
        const guildEco = ougi.db().getGuildEconomy(msg.guildId);
        if (!isCommand && guildEco.channels.includes(msg.channel.id)) ougi.economy('xp', msg);
    }
    if (ourConcern) {
        const showAd = ougi.db().recordInteraction(msg.author.id, msg.channel.id, Date.now());
        if (showAd) {
            await ougi.patreonCommand(msg, true);
        }
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (!user || user.bot || user.id === client.user.id) return;
    if (!ougi.startup() || ougi.db().isIgnored(user.id)) return;

    const guildId = reaction.message.guildId;
    if (!guildId) return;

    // Normalize key: raw char for Unicode, ID for custom/app
    const emojiKey = reaction.emoji.id ? reaction.emoji.id : reaction.emoji.name;

    const shortcut = ougi.db().getShortcuts(guildId)?.[emojiKey];
    if (!shortcut) return;

    const msg = {
        id: 0,
        content: ougi.helperFunctions.prependPrefix(ougi.helperFunctions.stripPrefixStr(shortcut.action, guildId)),
        author: user,
        channelId: reaction.message.id,
        channel: reaction.message.channel,
        guild: reaction.message.guild,
        guildId: reaction.message.guildId,
        mentions: reaction.message.mentions,
        client: reaction.message.client,
        reference: { messageId: reaction.message.id, guildId: reaction.message.guildId, channelId: reaction.message.channelId },
        isReactionShortcut: true,
        delete: () => {
            return { catch: (__) => { } };
        },
        reply: (_) => {
            return { catch: (__) => { } };
        }
    };

    await ougi.processCommand(msg);
});

/* ===== Eventos de Sniping ===== */
['messageDelete', 'messageUpdate'].forEach(event => {
    client.on(event, async (msg) => {
        if (!msg?.author || msg.author.bot) return;
        if (!ougi.startup() || ougi.db().isIgnored(msg.author.id)) return;
        if (msg.channel.type === Discord.ChannelType.GuildText) {
            const blacklist = ougi.db().getBlacklist(msg.guildId);
            if ((event === 'messageDelete' && blacklist.includes('snipe')) ||
                (event === 'messageUpdate' && blacklist.includes('editsnipe'))) return;
        }
        ougi.loadSniper(msg, event === 'messageUpdate');
    });
});

/* ===== Intervalos de Backup ===== */
setInterval(async () => {
    if (!TEASEABLE || !ougi.startup()) return;
    ougi.db().checkpointAll();
    for (const [key, data] of Object.entries(database)) {
        if (fs.existsSync(data.file) && (ougi.db().isDirty(data.file) || ougi.db().hasFileChanged(data.file))) {
            const success = await ougi.backup(data.file, data.id);
            if (success) {
                ougi.db().recordFileHash(data.file);
            }
        }
    }
}, 300_000);

/* ===== Intervalo para Recordatorios de Bump ===== */
setInterval(async () => {
    if (!TEASEABLE || !ougi.startup()) return;
    const now = Date.now();
    const bumpConfigs = ougi.db().getBumpConfig() || {};
    for (const [bumpGuild, bumpData] of Object.entries(bumpConfigs)) {
        if (bumpData.next_bump && bumpData.next_bump < now && !bumpData.reminded) {
            ougi.globalLog(await ougi.text({ lang: 'en', stringID: "console_bumpReminded", values: { guild: bumpGuild } }));
            const message = await ougi.text({
                lang: ougi.db().getLang(bumpGuild) || "en",
                stringID: "bumpNow",
                values: { timeStamp: `<t:${Math.floor(now / 1000)}:t>` }
            });
            const channel = client.channels.cache.get(bumpData.channel);
            if (channel) await channel.send(`${message}${bumpData.role ? `\n<@&${bumpData.role}>` : ''}`);
            bumpData.reminded = true;
            ougi.db().setBumpConfig(bumpGuild, bumpData);
        }
    }

    for (const [guildId, guildData] of Object.entries(global.rafflesOBJ || {})) {
        if (guildData.licensedUntil < now) continue;

        (guildData.ongoingRaffles || []).forEach((raffle, idx) => {
            if (raffle.config.endsAt <= now && !raffle.finished) {
                ougi.raffleExecute(guildId, idx);
            }
        });
    }
}, 60_000);

/* ===== Manejo de Excepciones Globales ===== */
process.on('uncaughtException', async (e) => {
    try {
        console.log(e);
        let trimmed = JSON.stringify(e, Object.getOwnPropertyNames(e), 4).replace(/\\n/g, '\n');
        while (trimmed.length > 0) {
            await client.users.cache.get(davidUserID)?.send("```" + trimmed.slice(0, 1994) + "```");
            trimmed = trimmed.slice(1994);
        }
    } catch {
        console.log(await ougi.text({ lang: 'en', stringID: "console_dmDavidFailed" }));
        console.log(e);
    }
});

/* ===== Login ===== */
client.login(process.env.TOKEN);