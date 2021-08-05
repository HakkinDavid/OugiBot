module.exports =

async function (msg, permissionsArray) {
    if (msg.channel.type !== "text") {
        return true
    }
    if (msg.guild.me.hasPermission(permissionsArray)) {
        return true
    }
    let myPermsArr = msg.guild.me.permissionsIn(msg.channel).toArray();
    let missingPerms = [];
    for (i=0; permissionsArray.length > i; i++) {
        if (myPermsArr.indexOf(permissionsArray[i]) === -1) {
            missingPerms.push(await ougi.text(msg, permissionsArray[i]))
        }
    }
    let permsString = (await ougi.text(msg, "insufficientPerms")) + "\n•`" + missingPerms.join("`\n•`") + "`";
    ougi.globalLog("Missing permissions handled as:\n" + permsString);
    msg.channel.send(permsString);
    return false;
}
