const { EmbedBuilder, ChannelType } = require('discord.js');

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
    const rateLimitResult = ougi.db().checkRateLimit(msg.author.id);
    if (rateLimitResult.ratelimited) {
        msg.channel.send((await ougi.text(msg, "ratelimited")).replace('{t}', `\`${rateLimitResult.waitTime}\``));
        ougi.globalLog(`Rate limit applied to user ${msg.author.username} (${rateLimitResult.waitTime}s)`);
        return;
    }

    // Ban check
    const userBan = ougi.db().checkBan(msg.author.id);
    if (userBan) {
        if (userBan.expired) {
            await msg.channel.send("Your ban sentence has expired.");
        } else if (userBan.active) {
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
        if (ougi.db().isBlacklisted(msg.guildId, spookyCommand) || ougi.db().isBlacklisted(msg.guildId, parts.slice(1).join(' '))) {
            await msg.channel.send(`Sorry, that's blacklisted in ${msg.guild.toString()}.`).catch(console.error);
            return;
        }
        ougi.guildLog(msg);
    }

    ougi.globalLog(msg);

    // Check permissions
    if (!await ougi.checkPerms(msg, mustHavePerms)) return;

    // Comandos Map
    const commandMap = {
        help: async () => ougi.helpCommand(args, msg),
        calc: async () => ougi.calculateCommand(args, msg),
        say: async () => ougi.sayCommand(args, msg),
        dice: async () => ougi.diceCommand(msg),
        answer: async () => ougi.answerCommand(msg),
        image: async () => ougi.imageCommand(args, msg),
        curl: async () => ougi.curlCommand(msg),
        embed: async () => ougi.spookyEmbed(msg),
        news: async () => ougi.newsCommand(args, msg),
        work: async () => ougi.workCommand(msg),
        daily: async () => ougi.dailyCommand(args, msg),
        pay: async () => ougi.payCommand(args, msg),
        leaderboard: async () => ougi.leaderboardCommand(args, msg),
        slots: async () => ougi.gamblingCommands(args, msg, 'slots'),
        coinflip: async () => ougi.gamblingCommands(args, msg, 'coinflip'),
        gamble: async () => ougi.gamblingCommands(args, msg, 'gamble'),
        storytell: async () => ougi.storytellCommand(args, msg),
        balance: async () => ougi.balanceCheck(args, msg),
        bal: async () => ougi.balanceCheck(args, msg),
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
        lyrics: async () => ougi.lyrics(args, msg),
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
            const guildRaffles = ougi.db().getGuildRaffles(msg.guildId);
            await ougi.raffleExecute(msg.guildId, guildRaffles?.ongoingRaffles?.findIndex(r => r.messageId == msg.reference?.messageId));
        },
        "admin-register": async () => ougi.adminRegister(args, msg)
    };

    const musicCommands = ["music", "skip", "stop", "play", "p"];
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