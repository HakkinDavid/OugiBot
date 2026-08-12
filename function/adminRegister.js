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
        // Remove each mentioned user ID if present
        for (const id of mentionedUsers) {
            ougi.db().removeGuildAdmin(msg.guildId, id);
        }
    }

    // Confirmation message
    const actionText = action === "add" ? "Added administrators:" : "Removed administrators:";
    const currentAdmins = ougi.db().getGuildAdmins(msg.guildId);
    msg.channel.send(`${actionText}\n\`\`\`${mentionedUsers.join("\n")}\`\`\`\nCurrent administrators:\n\`\`\`${currentAdmins.join("\n")}\`\`\``);
}