module.exports =

async function (msg, permissionsArray) {
    if (msg.channel.type !== Discord.ChannelType.GuildText) {
        return true
    }
    let missingPerms = []
    try {
        missingPerms = await msg.guild.members.me.permissionsIn(msg.channel).missing(permissionsArray);
    }
    catch (e) {
        console.log(e);
        console.log("Permissions unchecked.");
    }
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
