const { EmbedBuilder, ChannelType } = require('discord.js');

module.exports = async function (msg) {
    // Normalizar espacios y saltos de línea preservando mayúsculas/minúsculas de argumentos
    const rawParts = msg.content.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim().split(' ');
    const spookyCommand = rawParts[1]?.toLowerCase();
    const args = rawParts.slice(2);

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
        msg.channel.send(await ougi.text({ msg, stringID: "ratelimited", values: { t: `\`${rateLimitResult.waitTime}\`` } }));
        ougi.globalLog(`Rate limit applied to user ${msg.author.username} (${rateLimitResult.waitTime}s)`);
        return;
    }

    // Ban check
    const userBan = ougi.db().checkBan(msg.author.id);
    if (userBan) {
        if (userBan.expired) {
            await msg.channel.send(await ougi.text({ msg, stringID: "ban_expiredSentence" }));
        } else if (userBan.active) {
            const banEmbed = new EmbedBuilder()
                .setColor("#20064F")
                .setTitle(await ougi.text({ msg, stringID: "ban_activeTitle" }))
                .setDescription(await ougi.text({ msg, stringID: "ban_activeDesc" }))
                .addFields(
                    { name: await ougi.text({ msg, stringID: "ban_expiresField" }), value: `<t:${Math.floor(userBan.until / 1000)}:f>` },
                    { name: await ougi.text({ msg, stringID: "ban_reasonField" }), value: userBan.reason || await ougi.text({ msg, stringID: "ban_noReason" }) }
                );
            await msg.channel.send({ embeds: [banEmbed] });
            return;
        }
    }

    // Blacklist check
    if (msg.inGuild && msg.inGuild()) {
        const fullCmdStr = rawParts.slice(1).join(' ').toLowerCase();
        if (ougi.db().isBlacklisted(msg.guildId, spookyCommand) || ougi.db().isBlacklisted(msg.guildId, fullCmdStr)) {
            await msg.channel.send(await ougi.text({ msg, stringID: "command_blacklistedInGuild", values: { guild: msg.guild.toString() } })).catch(console.error);
            return;
        }
        ougi.guildLog(msg);
    }

    ougi.globalLog(msg);

    // Check permissions
    if (!await ougi.checkPerms(msg, mustHavePerms)) return;

    // Comandos Map
    const commandMap = ougi.commandList.getCommandMap(args, msg);

    const musicCommands = [
        "music", "skip", "stop", "play", "p", "loop", "unloop",
        "pause", "resume", "unpause", "queue", "q", "list",
        "np", "nowplaying", "now-playing", "now",
        "remove", "dequeue", "unqueue", "radio", "live"
    ];
    const urlPattern = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/i;

    if (Object.prototype.hasOwnProperty.call(commandMap, spookyCommand) && typeof commandMap[spookyCommand] === 'function') {
        await commandMap[spookyCommand]();
    } else if (spookyCommand && urlPattern.test(spookyCommand)) {
        msg.content = 'ougi music ' + ougi.helperFunctions.stripPrefixMsg(msg);
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