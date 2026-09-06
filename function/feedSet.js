const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = async function (args, msg) {
    if (!(await ougi.guildCheck(msg))) return;
    if (!(await ougi.adminCheck(msg, true))) return;

    if (!args || args.length === 0) {
        msg.channel.send(await ougi.text({
            msg,
            stringID: "feed_setUsage",
            values: { command: "ougi help feed-set" }
        })).catch(console.error);
        return;
    }

    let targetChannelId = msg.channel.id;
    let targetRoleId = null;
    let feedInput = null;

    // Parse arguments: extract channel mention/id, role mention/id, and feed input string
    for (const arg of args) {
        if (arg.startsWith('<#') && arg.endsWith('>')) {
            const chId = arg.slice(2, -1);
            if (msg.guild.channels.cache.has(chId)) {
                targetChannelId = chId;
            }
        } else if (arg.startsWith('<@&') && arg.endsWith('>')) {
            const rId = arg.slice(3, -1);
            if (msg.guild.roles.cache.has(rId)) {
                targetRoleId = rId;
            }
        } else if (!feedInput) {
            feedInput = arg;
        }
    }

    if (!feedInput) {
        msg.channel.send(await ougi.text({
            msg,
            stringID: "feed_missingInput",
            values: { command: "ougi help feed-set" }
        })).catch(console.error);
        return;
    }

    const parsed = ougi.feedFetcher.normalizeFeedInput(feedInput);
    if (!parsed || !parsed.handle || !parsed.platform) {
        msg.channel.send(await ougi.text({
            msg,
            stringID: "feed_invalidInput",
            values: { input: feedInput }
        })).catch(console.error);
        return;
    }

    const platform = parsed.platform;
    const handle = parsed.handle;
    const isTiktok = platform === 'tiktok';
    const platName = isTiktok ? 'TikTok' : 'Instagram';

    const existing = ougi.db().getGuildFeed(msg.guildId, targetChannelId, platform, handle);

    // Check if identical subscription already exists
    if (existing && existing.ping_role_id === targetRoleId && existing.status === 'active') {
        msg.channel.send(await ougi.text({
            msg,
            stringID: "feed_alreadySubscribed",
            values: { handle: `@${handle}`, platform: platName, channel: `<#${targetChannelId}>` }
        })).catch(console.error);
        return;
    }

    // Check bot permissions in target channel
    const targetChannel = msg.guild.channels.cache.get(targetChannelId) 
        ?? await msg.guild.channels.fetch(targetChannelId).catch(() => null);

    if (targetChannel && msg.guild.members.me && typeof targetChannel.permissionsFor === 'function') {
        const perms = targetChannel.permissionsFor(msg.guild.members.me);
        if (!perms || !perms.has(PermissionFlagsBits.SendMessages) || !perms.has(PermissionFlagsBits.EmbedLinks)) {
            msg.channel.send(await ougi.text({
                msg,
                stringID: "feed_missingChannelPerms",
                values: { channel: `<#${targetChannelId}>` }
            })).catch(console.error);
            return;
        }
    }

    // Inform user of initial indexing
    const statusMsg = await msg.channel.send(await ougi.text({
        msg,
        stringID: "feed_indexing",
        values: { handle: `@${handle}`, platform: platform === 'tiktok' ? 'TikTok' : 'Instagram' }
    })).catch(() => null);

    // Initial broad fetch (fetch last 10 posts without spamming channel)
    let initialLastPostId = null;
    try {
        const initialItems = await ougi.feedFetcher.fetchProfile(platform, handle, 10);
        if (initialItems && initialItems.length > 0) {
            ougi.db().saveFeedCacheItems(platform, handle, initialItems);
            initialLastPostId = initialItems[0].post_id;
        }
    } catch (e) {
        console.error('[feed-set] Error in initial fetch:', e.message);
    }

    // Save to Database
    ougi.db().addGuildFeed(
        msg.guildId,
        targetChannelId,
        platform,
        handle,
        targetRoleId,
        null,
        initialLastPostId
    );
    const platColor = isTiktok ? '#FE2C55' : '#C13584';

    const embed = new EmbedBuilder()
        .setColor(platColor)
        .setTitle(await ougi.text({ msg, stringID: "feed_setSuccessTitle" }))
        .setDescription(await ougi.text({
            msg,
            stringID: "feed_setSuccessDesc",
            values: {
                handle: `@${handle}`,
                platform: platName,
                channel: `<#${targetChannelId}>`
            }
        }))
        .addFields(
            { 
                name: await ougi.text({ msg, stringID: "feed_fieldPlatform" }), 
                value: platName, 
                inline: true 
            },
            { 
                name: await ougi.text({ msg, stringID: "feed_fieldChannel" }), 
                value: `<#${targetChannelId}>`, 
                inline: true 
            },
            { 
                name: await ougi.text({ msg, stringID: "feed_fieldRole" }), 
                value: targetRoleId ? `<@&${targetRoleId}>` : (await ougi.text({ msg, stringID: "none" }) || 'None'), 
                inline: true 
            }
        )
        .setFooter({ text: "feedEmbed by Ougi", iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
        .setTimestamp();

    if (statusMsg && statusMsg.editable) {
        await statusMsg.edit({ content: null, embeds: [embed] }).catch(console.error);
    } else {
        await msg.channel.send({ embeds: [embed] }).catch(console.error);
    }
};
