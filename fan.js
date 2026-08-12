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
global.ytdl = require('ytdl-core-discord');
global.scrapeYt = require('scrape-yt');
global.KSoftClient = require('@ksoft/api').KSoftClient;
global.removeWords = require('remove-words');
global.NewsAPI = require('newsapi');
global.gis = require('async-g-i-s');
global.CryptoJS = require('crypto-js');
global.exec = require('child_process').exec;
global.Voice = require('@discordjs/voice').Voice;
global.path = require('node:path');
global.colors = require('@colors/colors/safe');

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
    locales: "820971831992647681",
    dynamicLocales: "880322518139957299",
    raffles: "1411177261172002906",
    economy: "1536866624253075527"
};

ougi.db().unloadAll();

let logMessages = [];
global.errorBackup = console.error;

/* ===== Manejo de Errores ===== */
console.error = (...args) => {
    logMessages.push(...args);
    if (!logMessages.at(-1)) return logMessages.pop();

    const criticalEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: "CONSOLE ERROR" })
        .setColor("#c20d00")
        .setFooter({ text: "errorLogEmbed by Ougi", iconURL: "https://github.com/HakkinDavid/OugiBot/blob/master/images/ougi.png?raw=true" })
        .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/fatal.png?raw=true")
        .setDescription(logMessages.pop().toString());

    errorBackup.apply(console, args);
    client.channels.cache.get(consoleLogging)?.send({ embeds: [criticalEmbed] }).catch(errorBackup);
};

/* ===== Sincronización de Base de Datos ===== */
async function syncData() {
    for (const [key, data] of Object.entries(database)) {
        if (!data.done) await ougi.fetch(data.id, data.file, key);
    }
}

/* ===== Eventos del Cliente ===== */
client.once('ready', async () => {
    try {
        await syncData();
        await client.application?.commands.set([
            {
                name: 'Translate',
                type: Discord.ApplicationCommandType.Message
            }
        ]).catch(console.error);
        client.channels.cache.get(consoleLogging)?.send(`**INSTANCE ID:** ${instanceID}\n**DEV:** ${process.env.DEV}\n**SILENT MODE:** ${!TEASEABLE}`).catch(console.error);
        console.log(`Instance ID: ${instanceID}`);
        ougi.startup();
    } catch (err) {
        console.error("Error en ougi.startup:", err);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction) return;
    if (!TEASEABLE && interaction.user.id !== davidUserID) return;
    if (!ougi.startup()) return;
    if (ougi.db().isIgnored(interaction.user.id)) {
        if (interaction.isRepliable()) {
            await interaction.reply({ content: "You are currently opted out from using Ougi.", flags: Discord.MessageFlags.Ephemeral }).catch(console.error);
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

    const lower = msg.content.toLowerCase();
    let ourConcern = false;
    if (lower.startsWith("ougi") || lower.startsWith("扇") || msg.mentions.has(client.user)) {
        await ougi.processCommand(msg);
        ourConcern = true;
    } else if (lower.startsWith("#ougi")) {
        await ougi.rootCommands(msg);
        ourConcern = true;
    } else if (msg.channel.type === Discord.ChannelType.DM && msg.content.length > 0) {
        if (msg.content === "I want to opt out from using Ougi [BOT].") {
            const pseudoMSG = Object.assign(Object.create(Object.getPrototypeOf(msg)), msg, { content: "ougi OPTOUTSTATEMENT" });
            ougi.globalLog(pseudoMSG);
            ougi.optout(msg);
        }
        else {
            ougi.genAIAbility(msg);
            ourConcern = true;
        }
    } else if (msg.channel.type === Discord.ChannelType.GuildText && msg.content.length > 0) {
        const prefix = ougi.db().getPrefix(msg.guildId) || '';
        let isCommand = false;

        if (prefix && lower.startsWith(prefix)) {
            msg.content = 'ougi ' + msg.content.slice(prefix.length).trim();
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
        content: 'ougi ' + shortcut.action,
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
        if (fs.existsSync(data.file)) {
            await ougi.backup(data.file, data.id);
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
            ougi.globalLog(`Reminded users to bump guild ${bumpGuild}`);
            const message = (await ougi.text(ougi.db().getLang(bumpGuild) || "en", "bumpNow"))
                .replace("{timeStamp}", `<t:${Math.floor(now / 1000)}:t>`);
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
        console.log('Unable to DM David for console error');
        console.log(e);
    }
});

/* ===== Login ===== */
client.login(process.env.TOKEN);