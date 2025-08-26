const { EmbedBuilder, ChannelType } = require('discord.js');
const patreonCommand = require('./patreonCommand');

module.exports = async function (msg) {
    // Normalizar espacios y saltos de línea
    msg.content = msg.content.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim();

    const parts = msg.content.toLowerCase().split(' ');
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
        const guildID = msg.guildId;
        const blacklist = settingsOBJ.blacklist?.[guildID] || [];
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
        help: () => ougi.helpCommand(args, msg), // ok
        calc: () => ougi.calculateCommand(args, msg), // ok
        say: () => ougi.sayCommand(args, msg), // ok
        dice: () => ougi.diceCommand(msg), // ok
        answer: () => ougi.answerCommand(msg), // ok
        image: () => ougi.imageCommand(args, msg), // ok
        curl: () => ougi.curlCommand(msg), // ok
        embed: () => ougi.spookyEmbed(msg), // ok
        news: () => ougi.newsCommand(args, msg), // ok
        work: () => ougi.workCommand(msg),
        balance: () => ougi.balanceCheck(args, msg),
        covidstats: () => ougi.covidstats(args, msg),
        healthcare: () => ougi.healthcare(msg),
        md: () => ougi.medicalDefinition(args, msg),
        stats: () => ougi.statsCommand(msg),
        tweet: () => ougi.tweet(msg),
        minesweeper: () => ougi.minesweeper(msg),
        newspaper: () => ougi.newspaper(args, msg),
        recipe: () => ougi.recipeCommand(args, msg),
        react: () => ougi.reactCommand(args, msg),
        learn: () => ougi.talkLearn(args, msg),
        forget: () => ougi.talkForget(args, msg),
        info: () => ougi.whoIsMe(args, msg),
        acknowledgement: () => ougi.tos(msg),
        translate: () => ougi.translateCommand(msg),
        "emoji": () => ougi.customEmoji(args, msg),
        "emoji-list": () => ougi.emojiList(args, msg),
        snipe: () => ougi.shootSniper(args, msg, false),
        editsnipe: () => ougi.shootSniper(args, msg, true),
        speak: () => ougi.voice(msg),
        reminder: () => ougi.remindMe(msg),
        prefix: () => ougi.prefix(args, msg),
        setlog: () => ougi.setLog(args, msg),
        setnews: () => ougi.setNews(args, msg),
        blacklist: () => ougi.rm(args, msg),
        allow: () => ougi.allowCommand(args, msg),
        language: () => ougi.lang(args, msg, false),
        survey: () => ougi.feedback(msg, true),
        results: () => ougi.results(msg),
        guildlanguage: () => ougi.lang(args, msg, true),
        "xp-channel": () => ougi.manageEconomy('channel', msg, args),
        economy: () => ougi.manageEconomy('economy', msg, args),
        seticon: () => ougi.economyIcons(args, msg),
        remindbump: () => ougi.remindBump(args, msg),
        patreon: () => ougi.patreonCommand(msg),
        shortcut: () => ougi.shortcutCommand(args, msg)
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
        await ougi.genAIAbility(msg);
    }
};