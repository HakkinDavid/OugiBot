const { EmbedBuilder, ChannelType } = require('discord.js');
const patreonCommand = require('./patreonCommand');

module.exports = async function (msg) {
    // Normalizar espacios y saltos de línea
    const parts = msg.content.toLowerCase().replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim().split(' ');
    const spookyCommand = parts[1];
    const args = parts.slice(2);

    const mustHavePerms = [
        "AddReactions",
        "ViewChannel",
        "SendMessages",
        "ManageMessages",
        "EmbedLinks",
        "AttachFiles",
        "UseExternalEmojis",
        "ManageWebhooks"
    ];

    // Rate-limit
    const now = Date.now();
    const lastTime = settingsOBJ.ratelimit[msg.author.id] || 0;
    if (now - lastTime <= 1500) {
        const waitTime = ((1500 - (now - lastTime)) / 1000).toFixed(1);
        msg.channel.send((await ougi.text(msg, "ratelimited")).replace('{t}', `\`${waitTime}\``));
        ougi.globalLog(`Rate limit applied to user ${msg.author.username} (${waitTime}s)`);
        return;
    }
    settingsOBJ.ratelimit[msg.author.id] = now;

    // Ban check
    const userBan = settingsOBJ.banned[msg.author.id];
    if (userBan) {
        const expired = !isNaN(userBan.until) && (userBan.until - now) <= 0;
        if (expired) {
            delete settingsOBJ.banned[msg.author.id];
            await msg.channel.send("Your ban sentence has expired.");
        } else {
            const banEmbed = new EmbedBuilder()
                .setColor("#20064F")
                .setTitle("It's a beautiful day outside...")
                .setDescription("Yoinks! Your right to use Ougi has been forfeited because of an inappropriate usage.")
                .addFields(
                    { name: "Ban expires until", value: `<t:${Math.floor(userBan.until / 1000)}:f>` },
                    { name: "Reason", value: userBan.reason || "No reason provided" }
                );
            await msg.channel.send({ embeds: [banEmbed] });
            return;
        }
    }

    // Blacklist check
    if (msg.channel.type === ChannelType.GuildText) {
        const blacklist = settingsOBJ.blacklist?.[msg.guildId] || [];
        if (blacklist.some(item => item.toLowerCase() === spookyCommand || item.toLowerCase() === parts.slice(1).join(' '))) {
            await msg.channel.send(`Sorry, that's blacklisted in ${msg.guild.toString()}.`).catch(console.error);
            return;
        }
        ougi.guildLog(msg);
    }

    ougi.globalLog(msg);

    // Check permissions
    if (!await ougi.checkPerms(msg, mustHavePerms)) return;

    // Comandos
    const commandMap = {
        help: async () => ougi.helpCommand(args, msg), // ok
        calc: async () => ougi.calculateCommand(args, msg), // ok
        say: async () => ougi.sayCommand(args, msg), // ok
        dice: async () => ougi.diceCommand(msg), // ok
        answer: async () => ougi.answerCommand(msg), // ok
        image: async () => ougi.imageCommand(args, msg), // ok
        curl: async () => ougi.curlCommand(msg), // ok
        embed: async () => ougi.spookyEmbed(msg), // ok
        news: async () => ougi.newsCommand(args, msg), // ok
        work: async () => ougi.workCommand(msg),
        balance: async () => ougi.balanceCheck(args, msg),
        covidstats: async () => ougi.covidstats(args, msg),
        healthcare: async () => ougi.healthcare(msg),
        md: async () => ougi.medicalDefinition(args, msg),
        stats: async () => ougi.statsCommand(msg),
        tweet: async () => ougi.tweet(msg),
        minesweeper: async () => ougi.minesweeper(msg),
        newspaper: async () => ougi.newspaper(args, msg),
        recipe: async () => ougi.recipeCommand(args, msg),
        react: async () => ougi.reactCommand(args, msg),
        learn: async () => ougi.talkLearn(args, msg),
        forget: async () => ougi.talkForget(args, msg),
        info: async () => ougi.whoIsMe(args, msg),
        acknowledgement: async () => ougi.tos(msg),
        translate: async () => ougi.translateCommand(msg),
        "emoji": async () => ougi.customEmoji(args, msg),
        "emoji-list": async () => ougi.emojiList(args, msg),
        snipe: async () => ougi.shootSniper(args, msg, false),
        editsnipe: async () => ougi.shootSniper(args, msg, true),
        speak: async () => ougi.voice(msg),
        reminder: async () => ougi.remindMe(msg),
        prefix: async () => ougi.prefix(args, msg),
        setlog: async () => ougi.setLog(args, msg),
        setnews: async () => ougi.setNews(args, msg),
        blacklist: async () => ougi.rm(args, msg),
        allow: async () => ougi.allowCommand(args, msg),
        language: async () => ougi.lang(args, msg, false),
        survey: async () => ougi.feedback(msg, true),
        results: async () => ougi.results(msg),
        guildlanguage: async () => ougi.lang(args, msg, true),
        "xp-channel": async () => ougi.manageEconomy('channel', msg, args),
        economy: async () => ougi.manageEconomy('economy', msg, args),
        seticon: async () => ougi.economyIcons(args, msg),
        remindbump: async () => ougi.remindBump(args, msg),
        patreon: async () => ougi.patreonCommand(msg),
        shortcut: async () => ougi.shortcutCommand(args, msg),
        raffle: async () => ougi.raffleCommand(args, msg),
        "raffle-register": async () => ougi.raffleRegister(args, msg),
        "raffle-join": async () => ougi.raffleJoin(args, msg),
        "raffle-execute": async () => {
            if (!(await ougi.guildCheck(msg))) return;
            if (!(await ougi.adminCheck(msg, true))) return;
            await ougi.raffleExecute(msg.guildId, rafflesOBJ[msg.guildId].ongoingRaffles?.findIndex(r => r.messageId == msg.reference.messageId));
        },
        "admin-register": async () => ougi.adminRegister(args, msg)
    };

    // Música y URLs
    const musicCommands = ["music", "skip", "stop", "remove", "lyrics", "play", "p"];
    const urlPattern = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/i;

    if (commandMap[spookyCommand]) {
        await commandMap[spookyCommand]();
    } else if (urlPattern.test(spookyCommand)) {
        msg.content = msg.content.replace("ougi", "ougi music");
        await ougi.voiceCallMusic(msg).catch(console.error);
    } else if (spookyCommand === "subscribe" && args.length === 0) {
        await ougi.subscribeCommand(msg);
    } else if (spookyCommand === "unsubscribe" && args.length === 0) {
        await ougi.unsubscribeCommand(msg);
    } else if (musicCommands.includes(spookyCommand)) {
        await ougi.voiceCallMusic(msg).catch(console.error);
    } else {
        await ougi.judgementAbility(msg);
    }
};