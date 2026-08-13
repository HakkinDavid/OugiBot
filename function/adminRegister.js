module.exports = async function (arguments, msg) {
    if (!(await ougi.guildCheck(msg))) return;
    if (!(await ougi.adminCheck(msg))) return;

    // Action: add or remove
    const action = arguments[0];
    // Extract mentioned user IDs from the message
    const mentionedUsers = Array.from(msg.mentions.users?.keys?.() || []);

    if (action !== "add" && action !== "remove") {
        msg.channel.send("Usage: add|remove @users");
        return;
    }
    if (!mentionedUsers.length) {
        msg.channel.send("You must mention user(s) to " + (action === "add" ? "register" : "remove") + " as administrators.");
        return;
    }

    if (action === "add") {
        // Add each mentioned user ID if not already present
        for (const id of mentionedUsers) {
            ougi.db().addGuildAdmin(msg.guildId, id);
        }
    } else if (action === "remove") {
        // Remove each mentioned user ID if present (excluding self and guild owner)
        for (const id of mentionedUsers) {
            if (id === msg.author.id) {
                msg.channel.send("⚠️ You cannot remove yourself from administrator list.");
                continue;
            }
            if (id === msg.guild?.ownerId) {
                msg.channel.send("⚠️ Guild Owner cannot be removed from administrator list.");
                continue;
            }
            ougi.db().removeGuildAdmin(msg.guildId, id);
        }
    }

    // Confirmation message
    const actionText = action === "add" ? "Added administrators:" : "Removed administrators:";
    const currentAdmins = ougi.db().getGuildAdmins(msg.guildId);
    const adminsDisplay = currentAdmins.length > 0 ? `\`\`\`\n${currentAdmins.join("\n")}\n\`\`\`` : "`None`";

    msg.channel.send(`${actionText}\n\`\`\`\n${mentionedUsers.join("\n")}\n\`\`\`\nCurrent custom administrators:\n${adminsDisplay}\n*(Note: Owner and users with Discord Administrator permissions are always authorized).*`);
}