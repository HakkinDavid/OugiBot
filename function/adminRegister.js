const { PermissionFlagsBits } = require('discord.js');

module.exports = async function (arguments, msg) {
    if (!(await ougi.guildCheck(msg))) return;

    const authorId = msg.author?.id ?? msg.user?.id;
    let member = msg.member;
    if (!member && msg.guild?.members) {
        member = msg.guild.members.cache.get(authorId) ?? await msg.guild.members.fetch(authorId).catch(() => null);
    }
    const isOwnerOrDiscordAdmin = msg.guild?.ownerId === authorId || 
        (member && (member.permissions.has(PermissionFlagsBits.Administrator) || member.permissions.has(PermissionFlagsBits.ManageGuild)));

    if (!isOwnerOrDiscordAdmin) {
        msg.channel.send(await ougi.text({ msg, stringID: "mustOwnOrAdmin" }));
        return;
    }

    // Action: add or remove
    const action = arguments[0]?.toLowerCase();
    // Extract mentioned user IDs or raw snowflake IDs from arguments
    const mentionedUsers = new Set(Array.from(msg.mentions?.users?.keys?.() || []));
    for (let i = 1; i < arguments.length; i++) {
        const idMatch = arguments[i].match(/^\d{17,20}$/);
        if (idMatch) {
            mentionedUsers.add(idMatch[0]);
        }
    }
    const targetIds = Array.from(mentionedUsers);

    if (action !== "add" && action !== "remove") {
        msg.channel.send(await ougi.text({ msg, stringID: "admin_usage", values: { usage: "add|remove @users" } }));
        return;
    }
    if (!targetIds.length) {
        msg.channel.send(await ougi.text({
            msg,
            stringID: "admin_mentionRequired",
            values: {
                action: action === "add" ? "register" : "remove"
            }
        }));
        return;
    }

    if (action === "add") {
        for (const id of targetIds) {
            ougi.db().addGuildAdmin(msg.guildId, id);
        }
    } else if (action === "remove") {
        for (const id of targetIds) {
            if (id === authorId) {
                msg.channel.send(await ougi.text({ msg, stringID: "admin_cantRemoveSelf" }));
                continue;
            }
            if (id === msg.guild?.ownerId) {
                msg.channel.send(await ougi.text({ msg, stringID: "admin_cantRemoveOwner" }));
                continue;
            }
            ougi.db().removeGuildAdmin(msg.guildId, id);
        }
    }

    // Confirmation message
    const actionText = action === "add" ? await ougi.text({ msg, stringID: "admin_addedHeader" }) : await ougi.text({ msg, stringID: "admin_removedHeader" });
    const currentAdmins = ougi.db().getGuildAdmins(msg.guildId);
    const adminsDisplay = currentAdmins.length > 0 ? `\`\`\`\n${currentAdmins.join("\n")}\n\`\`\`` : "`None`";
    const currentAdminsHeader = await ougi.text({ msg, stringID: "admin_currentAdmins" });
    const authNote = await ougi.text({ msg, stringID: "admin_authNote" });

    msg.channel.send(`${actionText}\n\`\`\`\n${targetIds.join("\n")}\n\`\`\`\n${currentAdminsHeader}\n${adminsDisplay}\n${authNote}`);
};