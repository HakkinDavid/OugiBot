const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

let isRunning = false;

/**
 * Builds the standard DiscordEmbed for a feed item (image posts).
 */
function buildFeedEmbed(item, options = {}) {
    const isTiktok = item.platform === 'tiktok';
    const platName = isTiktok ? 'TikTok' : 'Instagram';
    const platColor = isTiktok ? '#FE2C55' : '#C13584';
    const platIcon = isTiktok 
        ? 'https://github.com/HakkinDavid/OugiBot/blob/master/images/tt.png?raw=true' 
        : 'https://github.com/HakkinDavid/OugiBot/blob/master/images/ig.png?raw=true';

    const authorDisplayName = item.author_name && item.author_name.toLowerCase() !== item.handle.toLowerCase()
        ? `${item.author_name} (@${item.handle})`
        : `${platName} • @${item.handle}`;

    const postUrl = item.url || `https://${isTiktok ? 'tiktok.com/@' + item.handle : 'instagram.com/' + item.handle}`;

    const embed = new EmbedBuilder()
        .setColor(platColor)
        .setAuthor({ 
            name: authorDisplayName.slice(0, 256),
            iconURL: item.author_avatar || platIcon,
            url: postUrl 
        })
        .setURL(postUrl)
        .setTimestamp(item.published_at ? new Date(item.published_at * 1000) : new Date());

    // Only set description if a non-empty caption exists (prevents duplicated title/description)
    if (item.caption && item.caption.trim()) {
        embed.setDescription(item.caption.trim().slice(0, 4096));
    }

    let footerText = `feedEmbed by Ougi | @${item.handle} on ${platName}`;
    if (options.footerExtra) {
        footerText += ` | ${options.footerExtra}`;
    }

    embed.setFooter({ 
        text: footerText, 
        iconURL: (typeof client !== 'undefined' && client.user) ? client.user.displayAvatarURL({ dynamic: true, size: 4096 }) : null
    });

    if (item.thumbnail_url || (item.media_urls && item.media_urls[0])) {
        embed.setImage(item.thumbnail_url || item.media_urls[0]);
    }

    // Add stats field if metrics are available
    if (item.metrics && (item.metrics.views > 0 || item.metrics.likes > 0 || item.metrics.comments > 0)) {
        const stats = [];
        if (item.metrics.likes > 0) stats.push(`❤️ ${item.metrics.likes.toLocaleString()}`);
        if (item.metrics.comments > 0) stats.push(`💬 ${item.metrics.comments.toLocaleString()}`);
        if (item.metrics.views > 0) stats.push(`👁️ ${item.metrics.views.toLocaleString()}`);
        if (stats.length > 0) {
            embed.addFields({ name: 'Metrics', value: stats.join('  •  '), inline: true });
        }
    }

    return embed;
}

/**
 * Renders a feed item into a Discord message payload ({ content, embeds, components }).
 * For video posts: formatted message with custom emojis and fixer link to unfurl native player.
 * For image posts: Discord EmbedBuilder with HD thumbnail, metrics, author, and clean layout.
 */
function renderFeedItem(item, options = {}) {
    const isTiktok = item.platform === 'tiktok';
    const platName = isTiktok ? 'TikTok' : 'Instagram';
    const platEmoji = isTiktok ? '<:tiktok:1545938243617423420>' : '<:instagram:1545938308553773156>';
    const rolePing = options.pingRoleId ? `<@&${options.pingRoleId}>\n` : '';
    const isVideo = item.media_type === 'video';

    if (isVideo) {
        const lines = [];
        if (rolePing) lines.push(rolePing.trim());

        const authorDisplayName = item.author_name && item.author_name.toLowerCase() !== item.handle.toLowerCase()
            ? `${item.author_name} (@${item.handle})`
            : `${platName} • @${item.handle}`;

        const postUrl = item.url || `https://${isTiktok ? 'tiktok.com/@' + item.handle : 'instagram.com/' + item.handle}`;

        // Header: Emoji + Platform • @handle
        lines.push(`${platEmoji} **[${authorDisplayName}](${postUrl})**`);

        // Caption (quoted)
        if (item.caption && item.caption.trim()) {
            const cleanCaption = item.caption.trim().split('\n').map(l => `> ${l}`).join('\n');
            lines.push(cleanCaption.slice(0, 1024));
        }

        // Metrics: likes, comments, views
        const metricsParts = [];
        if (item.metrics) {
            if (item.metrics.likes > 0) metricsParts.push(`❤️ ${item.metrics.likes.toLocaleString()}`);
            if (item.metrics.comments > 0) metricsParts.push(`💬 ${item.metrics.comments.toLocaleString()}`);
            if (item.metrics.views > 0) metricsParts.push(`👁️ ${item.metrics.views.toLocaleString()}`);
        }
        if (metricsParts.length > 0) {
            lines.push(metricsParts.join('  •  '));
        }

        // Fixer link for native Discord video unfurl
        lines.push(item.embed_url || item.url);

        return {
            content: lines.join('\n'),
            embeds: [],
            components: options.components || []
        };
    } else {
        const embed = buildFeedEmbed(item, options);
        const contentStr = rolePing.trim();

        return {
            content: contentStr.length > 0 ? contentStr : null,
            embeds: [embed],
            components: options.components || []
        };
    }
}

/**
 * Dispatches a batch of new items to all subscribed channels for a given profile.
 */
async function dispatchNewItems(platform, handle, newItems, subscriptions) {
    if (!newItems || newItems.length === 0 || !subscriptions || subscriptions.length === 0) return;

    for (const item of newItems) {
        for (const sub of subscriptions) {
            try {
                // Fetch channel
                const channel = client.channels.cache.get(sub.channel_id) 
                    ?? await client.channels.fetch(sub.channel_id).catch(() => null);

                if (!channel) {
                    console.log(`[FeedDispatcher] Channel ${sub.channel_id} in guild ${sub.guild_id} not found. Removing subscription.`);
                    ougi.db().removeGuildFeed(sub.guild_id, sub.handle, sub.channel_id);
                    continue;
                }

                // Verify permissions
                if (channel.guild?.members?.me) {
                    const perms = channel.permissionsFor(channel.guild.members.me);
                    if (!perms || !perms.has(PermissionFlagsBits.SendMessages) || !perms.has(PermissionFlagsBits.EmbedLinks)) {
                        console.log(`[FeedDispatcher] Missing permissions in channel ${sub.channel_id}.`);
                        continue;
                    }
                }

                // Filter keywords check if configured
                if (sub.filter_keywords) {
                    const keywords = sub.filter_keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
                    const caption = (item.caption || '').toLowerCase();
                    const matches = keywords.some(k => caption.includes(k));
                    if (!matches) continue;
                }

                const payload = renderFeedItem(item, { pingRoleId: sub.ping_role_id });
                await channel.send(payload).catch(err => {
                    console.error(`[FeedDispatcher] Error sending to channel ${sub.channel_id}:`, err.message);
                });

            } catch (err) {
                console.error(`[FeedDispatcher] Failed delivering item ${item.id} to channel ${sub.channel_id}:`, err);
            }
        }
    }
}

/**
 * Main polling ticker executed on an interval (every 5 minutes).
 */
async function tickFeedDispatcher() {
    if (isRunning) return;
    isRunning = true;

    try {
        const activeFeeds = ougi.db().getAllActiveFeeds();
        if (!activeFeeds || activeFeeds.length === 0) {
            isRunning = false;
            return;
        }

        // Build inverted index: Map<"platform:handle", Array<FeedSub>>
        const invertedIndex = new Map();
        for (const feed of activeFeeds) {
            const key = `${feed.platform.toLowerCase()}:${feed.handle.toLowerCase()}`;
            if (!invertedIndex.has(key)) {
                invertedIndex.set(key, []);
            }
            invertedIndex.get(key).push(feed);
        }

        // Process each unique profile once
        for (const [profileKey, subs] of invertedIndex.entries()) {
            const [platform, handle] = profileKey.split(':');

            // Quick channel existence validation for subscriptions
            const validSubs = [];
            for (const sub of subs) {
                const ch = client.channels.cache.get(sub.channel_id) 
                    ?? await client.channels.fetch(sub.channel_id).catch(() => null);
                if (ch) {
                    validSubs.push(sub);
                } else {
                    console.log(`[FeedDispatcher] Cleaning up missing channel ${sub.channel_id} for @${handle}`);
                    ougi.db().removeGuildFeed(sub.guild_id, sub.handle, sub.channel_id);
                }
            }

            if (validSubs.length === 0) {
                ougi.db().cleanupOrphanedFeedCache();
                continue;
            }

            // Fetch profile
            try {
                const items = await ougi.feedFetcher.fetchProfile(platform, handle, 10);
                if (items && items.length > 0) {
                    // Update Universal Cache
                    ougi.db().saveFeedCacheItems(platform, handle, items);

                    // For each subscription, detect new items
                    for (const sub of validSubs) {
                        let newPosts = [];

                        if (!sub.last_post_id) {
                            // First time or uninitialized: set latest post ID without spamming
                            ougi.db().updateFeedLastPost(sub.guild_id, sub.channel_id, platform, handle, items[0].post_id);
                        } else {
                            // Find posts newer than last_post_id
                            const lastIdx = items.findIndex(it => it.post_id === sub.last_post_id);
                            if (lastIdx > 0) {
                                // Items before lastIdx are newer
                                newPosts = items.slice(0, lastIdx).reverse();
                            } else if (lastIdx === -1) {
                                // If last_post_id not found in top 10, take top 3 as latest
                                newPosts = items.slice(0, 3).reverse();
                            }

                            if (newPosts.length > 0) {
                                await dispatchNewItems(platform, handle, newPosts, [sub]);
                                const newestPostId = items[0].post_id;
                                ougi.db().updateFeedLastPost(sub.guild_id, sub.channel_id, platform, handle, newestPostId);
                            }
                        }
                    }
                } else {
                    // Handled empty or failed fetch
                    for (const sub of validSubs) {
                        const errors = (sub.consecutive_errors || 0) + 1;
                        if (errors >= 3) {
                            ougi.db().setFeedStatus(sub.guild_id, sub.channel_id, platform, handle, 'paused', errors);
                            console.error(`[FeedDispatcher] Feed @${handle} (${platform}) in guild ${sub.guild_id} paused due to 3 consecutive fetch failures.`);
                        } else {
                            ougi.db().setFeedStatus(sub.guild_id, sub.channel_id, platform, handle, 'active', errors);
                        }
                    }
                }
            } catch (err) {
                console.error(`[FeedDispatcher] Error processing profile ${profileKey}:`, err.message);
            }

            // Small jitter between profiles (1.5s)
            await new Promise(r => setTimeout(r, 1500));
        }

        // Prune orphaned cached items if no servers listen to them
        ougi.db().cleanupOrphanedFeedCache();

    } catch (e) {
        console.error('[FeedDispatcher] Global ticker error:', e);
    } finally {
        isRunning = false;
    }
}

module.exports = {
    buildFeedEmbed,
    renderFeedItem,
    dispatchNewItems,
    tick: tickFeedDispatcher
};
