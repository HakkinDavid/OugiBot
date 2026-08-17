const { PermissionFlagsBits } = require('discord.js');

module.exports = async function (msg, silent = false) {
    if (!msg || !msg.guild) return false;

    const authorId = msg.author?.id ?? msg.user?.id;
    if (!authorId) return false;

    // Check if user is Guild Owner
    if (msg.guild.ownerId === authorId) {
        return true;
    }

    let member = msg.member;
    if (!member && msg.guild.members) {
        member = msg.guild.members.cache.get(authorId) ?? await msg.guild.members.fetch(authorId).catch(() => null);
    }

    // Check if user has Administrator or ManageGuild permissions in Discord
    if (member && (member.permissions.has(PermissionFlagsBits.Administrator) || member.permissions.has(PermissionFlagsBits.ManageGuild))) {
        return true;
    }

    // Check registered custom admins
    if (ougi.db().getGuildAdmins(msg.guildId).includes(authorId)) {
        return true;
    }

    if (!silent) {
        const text = await ougi.text({ msg, stringID: "mustOwnOrAdmin" }).catch(() => "You must be an administrator to perform this action.");
        if (msg.channel?.send) msg.channel.send(text).catch(() => {});
    }
    return false;
};