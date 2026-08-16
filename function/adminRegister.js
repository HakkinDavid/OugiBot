module.exports = async function (arguments, msg) {
    if (!(await ougi.guildCheck(msg))) return;
    if (!(await ougi.adminCheck(msg))) return;

    // Action: add or remove
    const action = arguments[0];
    // Extract mentioned user IDs from the message
    const mentionedUsers = Array.from(msg.mentions.users?.keys?.() || []);

    if (action !== "add" && action !== "remove") {
        msg.channel.send(await ougi.text({ msg, stringID: "admin_usage", values: { usage: "add|remove @users" } }));
        return;
    }
    if (!mentionedUsers.length) {
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
        // Add each mentioned user ID if not already present
        for (const id of mentionedUsers) {
            ougi.db().addGuildAdmin(msg.guildId, id);
        }
    } else if (action === "remove") {
        // Remove each mentioned user ID if present (excluding self and guild owner)
        for (const id of mentionedUsers) {
            if (id === msg.author.id) {
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

    msg.channel.send(`${actionText}\n\`\`\`\n${mentionedUsers.join("\n")}\n\`\`\`\n${currentAdminsHeader}\n${adminsDisplay}\n${authNote}`);
}