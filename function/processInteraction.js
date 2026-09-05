const { EmbedBuilder, ChannelType, MessageFlags } = require('discord.js');

module.exports = async function (interaction) {
    if (!interaction) return;

    // Rate-limit
    const userId = interaction.user.id;
    const rateLimitResult = ougi.db().checkRateLimit(userId);
    if (rateLimitResult.ratelimited) {
        const limitMsg = await ougi.text({
            msg: interaction,
            stringID: "ratelimited",
            values: { t: `\`${rateLimitResult.waitTime}\`` }
        });
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: limitMsg, flags: MessageFlags.Ephemeral }).catch(console.error);
        } else {
            await interaction.reply({ content: limitMsg, flags: MessageFlags.Ephemeral }).catch(console.error);
        }
        ougi.globalLog(`Rate limit applied to user ${interaction.user.username} (${rateLimitResult.waitTime}s)`);
        return;
    }

    // Ban check
    const userBan = ougi.db().checkBan(userId);
    if (userBan && userBan.active) {
        const banEmbed = new EmbedBuilder()
            .setColor("#20064F")
            .setTitle(await ougi.text({ msg: interaction, stringID: "ban_activeTitle" }))
            .setDescription(await ougi.text({ msg: interaction, stringID: "ban_activeDesc" }))
            .addFields(
                { name: await ougi.text({ msg: interaction, stringID: "ban_expiresField" }), value: `<t:${Math.floor(userBan.until / 1000)}:f>` },
                { name: await ougi.text({ msg: interaction, stringID: "ban_reasonField" }), value: userBan.reason || await ougi.text({ msg: interaction, stringID: "ban_noReason" }) }
            );
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ embeds: [banEmbed], flags: MessageFlags.Ephemeral }).catch(console.error);
        } else {
            await interaction.reply({ embeds: [banEmbed], flags: MessageFlags.Ephemeral }).catch(console.error);
        }
        return;
    }

    // Blacklist check
    if (interaction.guildId && ougi.db().isBlacklisted(interaction.guildId, 'translate')) {
        const blMsg = await ougi.text({ msg: interaction, stringID: "interaction_translateBlacklisted" });
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: blMsg, flags: MessageFlags.Ephemeral }).catch(console.error);
        } else {
            await interaction.reply({ content: blMsg, flags: MessageFlags.Ephemeral }).catch(console.error);
        }
        return;
    }

    if (interaction.isMessageContextMenuCommand()) {
        if (interaction.commandName === 'Translate') {
            await ougi.translateCommand(interaction);
        }
    } else if (interaction.isStringSelectMenu()) {
        if (interaction.customId.startsWith('ougi_translate_select_lang:')) {
            await ougi.translateCommand(interaction);
        }
    } else if (interaction.isButton()) {
        if (interaction.customId.startsWith('feed_nav:')) {
            const parts = interaction.customId.split(':');
            let cacheItems = [];
            let clampedIndex = 0;
            let totalCount = 0;
            let prevCustomId = '';
            let nextCustomId = '';
            let footerText = '';
            let isTiktok = false;
            let directUrl = 'https://instagram.com';

            const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

            if (parts[1] === 'single') {
                const platform = parts[2];
                const handle = parts[3];
                const targetIndex = parseInt(parts[4], 10) || 0;
                const originalAuthorId = parts[5];
                isTiktok = platform === 'tiktok';
                const platName = isTiktok ? 'TikTok' : 'Instagram';

                cacheItems = ougi.db().getFeedCache(platform, handle, 50);
                if (!cacheItems || cacheItems.length === 0) {
                    await interaction.reply({ content: "Feed cache is empty or expired.", flags: MessageFlags.Ephemeral }).catch(() => {});
                    return;
                }

                totalCount = cacheItems.length;
                clampedIndex = Math.max(0, Math.min(targetIndex, totalCount - 1));
                const item = cacheItems[clampedIndex];
                directUrl = item.url || `https://${isTiktok ? 'tiktok.com' : 'instagram.com'}`;
                footerText = `feedEmbed by Ougi | @${item.handle} on ${platName} | Page ${clampedIndex + 1} of ${totalCount}`;

                prevCustomId = `feed_nav:single:${platform}:${handle}:${clampedIndex - 1}:${originalAuthorId}`;
                nextCustomId = `feed_nav:single:${platform}:${handle}:${clampedIndex + 1}:${originalAuthorId}`;

            } else if (parts[1] === 'fyp') {
                const guildId = parts[2];
                const channelId = parts[3];
                const targetIndex = parseInt(parts[4], 10) || 0;
                const originalAuthorId = parts[5];

                cacheItems = ougi.db().getBlendedFeedCacheForChannel(guildId, channelId, 50);
                if (!cacheItems || cacheItems.length === 0) {
                    await interaction.reply({ content: "Feed cache is empty or expired.", flags: MessageFlags.Ephemeral }).catch(() => {});
                    return;
                }

                totalCount = cacheItems.length;
                clampedIndex = Math.max(0, Math.min(targetIndex, totalCount - 1));
                const item = cacheItems[clampedIndex];
                isTiktok = item.platform === 'tiktok';
                const platName = isTiktok ? 'TikTok' : 'Instagram';
                const channel = interaction.guild?.channels?.cache?.get(channelId);
                const channelName = channel?.name || 'feed';

                directUrl = item.url || `https://${isTiktok ? 'tiktok.com' : 'instagram.com'}`;
                footerText = `FYP #${channelName} • @${item.handle} on ${platName} | Page ${clampedIndex + 1} of ${totalCount}`;

                prevCustomId = `feed_nav:fyp:${guildId}:${channelId}:${clampedIndex - 1}:${originalAuthorId}`;
                nextCustomId = `feed_nav:fyp:${guildId}:${channelId}:${clampedIndex + 1}:${originalAuthorId}`;

            } else {
                // Fallback legacy format: feed_nav:platform:handle:index:authorId
                const platform = parts[1];
                const handle = parts[2];
                const targetIndex = parseInt(parts[3], 10) || 0;
                const originalAuthorId = parts[4];
                isTiktok = platform === 'tiktok';
                const platName = isTiktok ? 'TikTok' : 'Instagram';

                cacheItems = ougi.db().getFeedCache(platform, handle, 50);
                if (!cacheItems || cacheItems.length === 0) {
                    await interaction.reply({ content: "Feed cache is empty or expired.", flags: MessageFlags.Ephemeral }).catch(() => {});
                    return;
                }

                totalCount = cacheItems.length;
                clampedIndex = Math.max(0, Math.min(targetIndex, totalCount - 1));
                const item = cacheItems[clampedIndex];
                directUrl = item.url || `https://${isTiktok ? 'tiktok.com' : 'instagram.com'}`;
                footerText = `feedEmbed by Ougi | @${item.handle} on ${platName} | Page ${clampedIndex + 1} of ${totalCount}`;

                prevCustomId = `feed_nav:single:${platform}:${handle}:${clampedIndex - 1}:${originalAuthorId}`;
                nextCustomId = `feed_nav:single:${platform}:${handle}:${clampedIndex + 1}:${originalAuthorId}`;
            }

            const item = cacheItems[clampedIndex];

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(prevCustomId)
                    .setLabel('◀️ Previous')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(clampedIndex <= 0),
                new ButtonBuilder()
                    .setCustomId(nextCustomId)
                    .setLabel('Next ▶️')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(clampedIndex >= totalCount - 1),
                new ButtonBuilder()
                    .setLabel(isTiktok ? 'Open TikTok' : 'Open Instagram')
                    .setStyle(ButtonStyle.Link)
                    .setURL(directUrl)
            );

            const payload = ougi.feedDispatcher.renderFeedItem(item, {
                footerExtra: footerText.split(' | ').slice(2).join(' | '),
                components: [row]
            });

            await interaction.update(payload).catch(console.error);
        }
    }
};
