const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

let isRunning = false;

/**
 * Builds the standard DiscordEmbed for a feed item.
 */
function buildFeedEmbed(item) {
    const isTiktok = item.platform === 'tiktok';
    const platName = isTiktok ? 'TikTok' : 'Instagram';
    const platColor = isTiktok ? '#FE2C55' : '#C13584';
    const platIcon = isTiktok 
        ? 'https://github.com/HakkinDavid/OugiBot/blob/master/images/tiktok.png?raw=true' 
        : 'https://github.com/HakkinDavid/OugiBot/blob/master/images/instagram.png?raw=true';

    const embed = new EmbedBuilder()
        .setColor(platColor)
        .setAuthor({ 
            name: `${platName} • @${item.handle}`,
            iconURL: platIcon,
            url: item.url 
        })
        .setTitle((item.caption || `${platName} Post by @${item.handle}`).slice(0, 256))
        .setURL(item.url)
        .setDescription(item.caption ? item.caption.slice(0, 2048) : null)
        .setTimestamp(item.published_at ? new Date(item.published_at * 1000) : new Date())
        .setFooter({ 
            text: `feedEmbed by Ougi | @${item.handle} on ${platName}`, 
            iconURL: client.user?.displayAvatarURL({ dynamic: true, size: 4096 }) 
        });

    if (item.thumbnail_url) {
        embed.setImage(item.thumbnail_url);
    }

    // Add stats field if metrics are available
    if (item.metrics && (item.metrics.views || item.metrics.likes)) {
        const stats = [];
        if (item.metrics.views) stats.push(`👁️ ${item.metrics.views.toLocaleString()}`);
        if (item.metrics.likes) stats.push(`❤️ ${item.metrics.likes.toLocaleString()}`);
        if (item.metrics.comments) stats.push(`💬 ${item.metrics.comments.toLocaleString()}`);
        if (stats.length > 0) {
            embed.addFields({ name: 'Metrics', value: stats.join('  •  '), inline: true });
        }
    }

    return embed;
}

/**
 * Dispatches a batch of new items to all subscribed channels for a given profile.
 */
async function dispatchNewItems(platform, handle, newItems, subscriptions) {
    if (!newItems || newItems.length === 0 || !subscriptions || subscriptions.length === 0) return;

    for (const item of newItems) {
        const embed = buildFeedEmbed(item);

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

                const content = `${sub.ping_role_id ? `<@&${sub.ping_role_id}> ` : ''}${item.embed_url || item.url}`;
                await channel.send({ content, embeds: [embed] }).catch(err => {
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
    dispatchNewItems,
    tick: tickFeedDispatcher
};
