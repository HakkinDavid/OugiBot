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

    if (!Array.isArray(settingsOBJ.guildAdmins[msg.guildId])) {
        settingsOBJ.guildAdmins[msg.guildId] = [];
    }

    if (action === "add") {
        // Add each mentioned user ID if not already present
        for (const id of mentionedUsers) {
            if (!settingsOBJ.guildAdmins[msg.guildId].includes(id)) settingsOBJ.guildAdmins[msg.guildId].push(id);
        }
    } else if (action === "remove") {
        // Remove each mentioned user ID if present
        settingsOBJ.guildAdmins[msg.guildId] = settingsOBJ.guildAdmins[msg.guildId].filter(id => !mentionedUsers.includes(id));
    }

    // Confirmation message
    const actionText = action === "add" ? "Added administrators:" : "Removed administrators:";
    msg.channel.send(`${actionText}\n\`\`\`${mentionedUsers.join("\n")}\`\`\`\nCurrent administrators:\n\`\`\`${settingsOBJ.guildAdmins[msg.guildId].join("\n")}\`\`\``);
    await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
    await ougi.backup(database.settings.file, channels.settings);
}