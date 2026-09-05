const { EmbedBuilder } = require('discord.js');

module.exports = async function (args, msg) {
    if (!(await ougi.guildCheck(msg))) return;
    if (!(await ougi.adminCheck(msg, true))) return;

    if (!args || args.length === 0) {
        msg.channel.send(await ougi.text({
            msg,
            stringID: "feed_removeUsage",
            values: { command: "ougi help feed-remove" }
        })).catch(console.error);
        return;
    }

    let targetChannelId = null;
    let targetRoleId = null;
    let feedInput = null;

    for (const arg of args) {
        if (arg.startsWith('<#') && arg.endsWith('>')) {
            const chId = arg.slice(2, -1);
            if (msg.guild.channels.cache.has(chId)) targetChannelId = chId;
        } else if (arg.startsWith('<@&') && arg.endsWith('>')) {
            const rId = arg.slice(3, -1);
            if (msg.guild.roles.cache.has(rId)) targetRoleId = rId;
        } else if (!feedInput) {
            feedInput = arg;
        }
    }

    let handle = null;
    if (feedInput) {
        const parsed = ougi.feedFetcher.normalizeFeedInput(feedInput);
        if (parsed && parsed.handle) {
            handle = parsed.handle;
        } else {
            msg.channel.send(await ougi.text({
                msg,
                stringID: "feed_invalidInput",
                values: { input: feedInput }
            })).catch(console.error);
            return;
        }
    }

    const removedCount = ougi.db().removeGuildFeed(
        msg.guildId,
        handle,
        targetChannelId,
        targetRoleId
    );

    if (removedCount > 0) {
        ougi.db().cleanupOrphanedFeedCache();

        const embed = new EmbedBuilder()
            .setColor("#230347")
            .setTitle(await ougi.text({ msg, stringID: "feed_removeSuccessTitle" }))
            .setDescription(await ougi.text({
                msg,
                stringID: "feed_removeSuccessDesc",
                values: {
                    count: removedCount,
                    handle: handle ? `@${handle}` : (await ougi.text({ msg, stringID: "allFeeds" }) || 'all matching feeds')
                }
            }))
            .setFooter({ text: "feedEmbed by Ougi", iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
            .setTimestamp();

        await msg.channel.send({ embeds: [embed] }).catch(console.error);
    } else {
        await msg.channel.send(await ougi.text({
            msg,
            stringID: "feed_notFound",
            values: { handle: handle ? `@${handle}` : '' }
        })).catch(console.error);
    }
};
