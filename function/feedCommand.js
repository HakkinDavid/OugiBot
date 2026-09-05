const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = async function (args, msg) {
    if (!(await ougi.guildCheck(msg))) return;

    let handle = null;
    let platform = null;
    let pageNumber = 1;
    let explicitProfile = false;

    // Parse arguments: handle / URL and optional page number
    if (args && args.length > 0) {
        for (const arg of args) {
            const num = parseInt(arg, 10);
            if (!isNaN(num) && num > 0) {
                pageNumber = num;
            } else {
                const parsed = ougi.feedFetcher.normalizeFeedInput(arg);
                if (parsed && parsed.handle && parsed.platform) {
                    platform = parsed.platform;
                    handle = parsed.handle;
                    explicitProfile = true;
                }
            }
        }
    }

    const pageIndex = Math.max(0, pageNumber - 1);

    if (explicitProfile && handle && platform) {
        // Mode 1: Single Profile Feed
        let cacheItems = ougi.db().getFeedCache(platform, handle, 50);

        if (!cacheItems || cacheItems.length === 0) {
            const fetched = await ougi.feedFetcher.fetchProfile(platform, handle, 10);
            if (fetched && fetched.length > 0) {
                ougi.db().saveFeedCacheItems(platform, handle, fetched);
                cacheItems = ougi.db().getFeedCache(platform, handle, 50);
            }
        }

        if (!cacheItems || cacheItems.length === 0) {
            msg.channel.send(await ougi.text({
                msg,
                stringID: "feed_noPostsFound",
                values: { handle: `@${handle}` }
            })).catch(console.error);
            return;
        }

        const totalCount = cacheItems.length;
        const clampedIndex = Math.min(pageIndex, totalCount - 1);
        const item = cacheItems[clampedIndex];

        const embed = ougi.feedDispatcher.buildFeedEmbed(item);
        const isTiktok = platform === 'tiktok';
        const platName = isTiktok ? 'TikTok' : 'Instagram';

        embed.setFooter({
            text: `feedEmbed by Ougi | @${item.handle} on ${platName} | Page ${clampedIndex + 1} of ${totalCount}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 })
        });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`feed_nav:single:${platform}:${handle}:${clampedIndex - 1}:${msg.author.id}`)
                .setLabel('◀️ Previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(clampedIndex <= 0),
            new ButtonBuilder()
                .setCustomId(`feed_nav:single:${platform}:${handle}:${clampedIndex + 1}:${msg.author.id}`)
                .setLabel('Next ▶️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(clampedIndex >= totalCount - 1),
            new ButtonBuilder()
                .setLabel(isTiktok ? 'Open TikTok' : 'Open Instagram')
                .setStyle(ButtonStyle.Link)
                .setURL(item.url || `https://${isTiktok ? 'tiktok.com' : 'instagram.com'}`)
        );

        await msg.channel.send({
            content: item.embed_url ? item.embed_url : null,
            embeds: [embed],
            components: [row]
        }).catch(console.error);

    } else {
        // Mode 2: Channel-blended FYP Feed
        const channelSubs = ougi.db().getGuildFeeds(msg.guildId, { channelId: msg.channelId });
        if (!channelSubs || channelSubs.length === 0) {
            msg.channel.send(await ougi.text({
                msg,
                stringID: "feed_noChannelFeeds",
                values: { command: "ougi help feed" }
            })).catch(console.error);
            return;
        }

        let cacheItems = ougi.db().getBlendedFeedCacheForChannel(msg.guildId, msg.channelId, 50);

        if (!cacheItems || cacheItems.length === 0) {
            // Attempt on-demand fetch for subscriptions in this channel
            for (const sub of channelSubs) {
                const fetched = await ougi.feedFetcher.fetchProfile(sub.platform, sub.handle, 10).catch(() => []);
                if (fetched && fetched.length > 0) {
                    ougi.db().saveFeedCacheItems(sub.platform, sub.handle, fetched);
                }
            }
            cacheItems = ougi.db().getBlendedFeedCacheForChannel(msg.guildId, msg.channelId, 50);
        }

        if (!cacheItems || cacheItems.length === 0) {
            msg.channel.send(await ougi.text({
                msg,
                stringID: "feed_noPostsFound",
                values: { handle: "channel feed" }
            })).catch(console.error);
            return;
        }

        const totalCount = cacheItems.length;
        const clampedIndex = Math.min(pageIndex, totalCount - 1);
        const item = cacheItems[clampedIndex];

        const embed = ougi.feedDispatcher.buildFeedEmbed(item);
        const isTiktok = item.platform === 'tiktok';
        const platName = isTiktok ? 'TikTok' : 'Instagram';
        const channelName = msg.channel.name || 'feed';

        embed.setFooter({
            text: `FYP #${channelName} • @${item.handle} on ${platName} | Page ${clampedIndex + 1} of ${totalCount}`,
            iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 })
        });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`feed_nav:fyp:${msg.guildId}:${msg.channelId}:${clampedIndex - 1}:${msg.author.id}`)
                .setLabel('◀️ Previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(clampedIndex <= 0),
            new ButtonBuilder()
                .setCustomId(`feed_nav:fyp:${msg.guildId}:${msg.channelId}:${clampedIndex + 1}:${msg.author.id}`)
                .setLabel('Next ▶️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(clampedIndex >= totalCount - 1),
            new ButtonBuilder()
                .setLabel(isTiktok ? 'Open TikTok' : 'Open Instagram')
                .setStyle(ButtonStyle.Link)
                .setURL(item.url || `https://${isTiktok ? 'tiktok.com' : 'instagram.com'}`)
        );

        await msg.channel.send({
            content: item.embed_url ? item.embed_url : null,
            embeds: [embed],
            components: [row]
        }).catch(console.error);
    }
};
