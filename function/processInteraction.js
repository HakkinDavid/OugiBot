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
            .setTitle("It's a beautiful day outside...")
            .setDescription("Yoinks! Your right to use Ougi has been forfeited because of an inappropriate usage.")
            .addFields(
                { name: "Ban expires until", value: `<t:${Math.floor(userBan.until / 1000)}:f>` },
                { name: "Reason", value: userBan.reason || "No reason provided" }
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
        const blMsg = `Sorry, translation is blacklisted in this server.`;
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
