const { PermissionFlagsBits } = require('discord.js');

module.exports = async function (msg, silent = false) {
    if (!msg.guild) return false;

    // Check if user is Guild Owner
    if (msg.guild.ownerId === msg.author.id) {
        return true;
    }

    // Check if user has Administrator or ManageGuild permissions in Discord
    if (msg.member && (msg.member.permissions.has(PermissionFlagsBits.Administrator) || msg.member.permissions.has(PermissionFlagsBits.ManageGuild))) {
        return true;
    }

    // Check registered custom admins
    if (ougi.db().getGuildAdmins(msg.guildId).includes(msg.author.id)) {
        return true;
    }

    if (!silent) msg.channel.send(await ougi.text(msg, "mustOwnOrAdmin"));
    return false;
};