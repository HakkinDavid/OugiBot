module.exports = async function (msg, permissionsArray) {
    if (!msg || !msg.guild || !msg.channel?.isTextBased?.()) {
        return true;
    }
    let missingPerms = [];
    try {
        const me = msg.guild.members.me ?? await msg.guild.members.fetchMe().catch(() => null);
        if (me) {
            missingPerms = me.permissionsIn(msg.channel).missing(permissionsArray) || [];
        }
    }
    catch (e) {
        console.error(e);
    }
    if (missingPerms.length === 0) {
        return true;
    }
    let missingPermsLocalized = [];
    for (let i = 0; i < missingPerms.length; i++) {
        missingPermsLocalized.push(await ougi.text({ msg, stringID: missingPerms[i] }) || missingPerms[i]);
    }
    let permsString = (await ougi.text({ msg, stringID: "insufficientPerms" })) + "\n•`" + missingPermsLocalized.join("`\n•`") + "`";
    ougi.globalLog("Missing permissions handled as:\n" + permsString);
    if (msg.channel?.send) msg.channel.send(permsString).catch(() => {});
    return false;
};
