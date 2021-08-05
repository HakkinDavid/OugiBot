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
    msg.channel.send((await ougi.text(msg, "insufficientPerms")) + "\n•`" + missingPerms.join("`\n•`") + "`");
}
