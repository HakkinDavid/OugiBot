const { EmbedBuilder } = require('discord.js');

module.exports = async function (args, msg) {
    if (!(await ougi.guildCheck(msg))) return;

    const filters = {};

    if (args && args.length > 0) {
        for (const arg of args) {
            if (arg.startsWith('<#') && arg.endsWith('>')) {
                filters.channelId = arg.slice(2, -1);
            } else if (arg.startsWith('<@&') && arg.endsWith('>')) {
                filters.pingRoleId = arg.slice(3, -1);
            } else {
                const parsed = ougi.feedFetcher.normalizeFeedInput(arg);
                if (parsed) {
                    if (parsed.platform) filters.platform = parsed.platform;
                    if (parsed.handle) filters.handle = parsed.handle;
                } else {
                    filters.handle = arg.replace(/^@/, '').toLowerCase();
                }
            }
        }
    }

    const feeds = ougi.db().getGuildFeeds(msg.guildId, filters);

    if (!feeds || feeds.length === 0) {
        msg.channel.send(await ougi.text({
            msg,
            stringID: "feed_listEmpty"
        })).catch(console.error);
        return;
    }

    const noneText = await ougi.text({ msg, stringID: "none" }).catch(() => "None") || "None";
    const lines = feeds.map((f, idx) => {
        const isTiktok = f.platform === 'tiktok';
        const icon = isTiktok ? '🎵' : '📷';
        const channelMention = `<#${f.channel_id}>`;
        const roleMention = f.ping_role_id ? `<@&${f.ping_role_id}>` : `\`${noneText}\``;
        const statusBadge = f.status === 'paused' ? '⏸️' : '🟢';

        return `\`${idx + 1}.\` ${icon} **@${f.handle}** ➜ ${channelMention} | 🔔 ${roleMention} ${statusBadge}`;
    });

    const embed = new EmbedBuilder()
        .setColor("#230347")
        .setTitle(await ougi.text({ msg, stringID: "feed_listTitle" }))
        .setDescription(lines.join('\n').slice(0, 4000))
        .setFooter({
            text: await ougi.text({
                msg,
                stringID: "feed_listFooter",
                values: { count: feeds.length }
            }) || `Total Feeds: ${feeds.length}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 })
        })
        .setTimestamp();

    await msg.channel.send({ embeds: [embed] }).catch(console.error);
};
