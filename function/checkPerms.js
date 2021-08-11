module.exports =

async function (msg, permissionsArray) {
    if (msg.channel.type !== "text") {
        return true
    }
    let missingPerms = await msg.guild.me.permissionsIn(msg.channel).missing(permissionsArray);
    if (missingPerms.length === 0) {
        return true
    }
    let missingPermsLocalized = [];
    for (i=0; missingPerms.length > i; i++) {
        missingPermsLocalized.push(await ougi.text(msg, missingPerms[i]))
    }
    let permsString = (await ougi.text(msg, "insufficientPerms")) + "\n•`" + missingPermsLocalized.join("`\n•`") + "`";
    ougi.globalLog("Missing permissions handled as:\n" + permsString);
    msg.channel.send(permsString);
    return false;
}
