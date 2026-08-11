const { EmbedBuilder, ChannelType, MessageFlags } = require('discord.js');

module.exports = async function (interaction) {
    if (!interaction) return;

    // Rate-limit
    const now = Date.now();
    const userId = interaction.user.id;
    const lastTime = settingsOBJ.ratelimit[userId] || 0;
    if (now - lastTime <= 250 && (!settingsOBJ.patrons || !settingsOBJ.patrons[userId])) {
        const waitTime = ((250 - (now - lastTime)) / 1000).toFixed(1);
        const limitMsg = (await ougi.text(interaction, "ratelimited")).replace('{t}', `\`${waitTime}\``);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: limitMsg, flags: MessageFlags.Ephemeral }).catch(console.error);
        } else {
            await interaction.reply({ content: limitMsg, flags: MessageFlags.Ephemeral }).catch(console.error);
        }
        ougi.globalLog(`Rate limit applied to user ${interaction.user.username} (${waitTime}s)`);
        return;
    }
    settingsOBJ.ratelimit[userId] = now;

    // Ban check
    const userBan = settingsOBJ.banned[userId];
    if (userBan) {
        const expired = !isNaN(userBan.until) && (userBan.until - now) <= 0;
        if (expired) {
            delete settingsOBJ.banned[userId];
        } else {
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
    }

    // Blacklist check
    if (interaction.guildId) {
        const blacklist = settingsOBJ.blacklist?.[interaction.guildId] || [];
        if (blacklist.some(item => item.toLowerCase() === 'translate')) {
            const blMsg = `Sorry, translation is blacklisted in this server.`;
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: blMsg, flags: MessageFlags.Ephemeral }).catch(console.error);
            } else {
                await interaction.reply({ content: blMsg, flags: MessageFlags.Ephemeral }).catch(console.error);
            }
            return;
        }
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
