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
            await msg.channel.send(await ougi.text(msg, "ban_expiredSentence"));
        } else if (userBan.active) {
            const banEmbed = new EmbedBuilder()
                .setColor("#20064F")
                .setTitle(await ougi.text(msg, "ban_activeTitle"))
                .setDescription(await ougi.text(msg, "ban_activeDesc"))
                .addFields(
                    { name: await ougi.text(msg, "ban_expiresField"), value: `<t:${Math.floor(userBan.until / 1000)}:f>` },
                    { name: await ougi.text(msg, "ban_reasonField"), value: userBan.reason || await ougi.text(msg, "ban_noReason") }
                );
            await msg.channel.send({ embeds: [banEmbed] });
            return;
        }
    }

    // Blacklist check
    if (msg.channel.type === ChannelType.GuildText) {
        if (ougi.db().isBlacklisted(msg.guildId, spookyCommand) || ougi.db().isBlacklisted(msg.guildId, parts.slice(1).join(' '))) {
            const blTemplate = await ougi.text(msg, "command_blacklistedInGuild");
            await msg.channel.send(blTemplate.replace(/{guild}/g, msg.guild.toString())).catch(console.error);
            return;
        }
        ougi.guildLog(msg);
    }

    ougi.globalLog(msg);

    // Check permissions
    if (!await ougi.checkPerms(msg, mustHavePerms)) return;

    // Comandos Map
    const commandMap = ougi.commandList.getCommandMap(args, msg);

    const musicCommands = ["music", "skip", "stop", "play", "p", "loop", "unloop"];
    const urlPattern = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/i;

    if (commandMap[spookyCommand]) {
        await commandMap[spookyCommand]();
    } else if (urlPattern.test(spookyCommand)) {
        msg.content = 'ougi music ' + ougi.helperFunctions.stripPrefixMsg(msg);
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