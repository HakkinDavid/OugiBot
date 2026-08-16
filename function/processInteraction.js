const { EmbedBuilder, ChannelType, MessageFlags } = require('discord.js');

module.exports = async function (interaction) {
    if (!interaction) return;

    // Rate-limit
    const userId = interaction.user.id;
    const rateLimitResult = ougi.db().checkRateLimit(userId);
    if (rateLimitResult.ratelimited) {
        const limitMsg = (await ougi.text(interaction, "ratelimited")).replace('{t}', `\`${rateLimitResult.waitTime}\``);
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
            .setTitle(await ougi.text(interaction, "ban_activeTitle"))
            .setDescription(await ougi.text(interaction, "ban_activeDesc"))
            .addFields(
                { name: await ougi.text(interaction, "ban_expiresField"), value: `<t:${Math.floor(userBan.until / 1000)}:f>` },
                { name: await ougi.text(interaction, "ban_reasonField"), value: userBan.reason || await ougi.text(interaction, "ban_noReason") }
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
        const blMsg = await ougi.text(interaction, "interaction_translateBlacklisted");
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
    }
};
