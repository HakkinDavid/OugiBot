module.exports =

async function (arguments, msg) {
    if (msg.channel.type !== Discord.ChannelType.GuildText) {
        msg.channel.send(await ougi.text(msg, "mustGuild"));
        return
    }

    if (!ougi.isAdmin(msg)) {
        msg.channel.send("You must be an administrator to perform this action.");
        return
    }

    switch (arguments[0]) {
        case "currency": {
            settingsOBJ.economy[msg.guild.id].currency = arguments.slice(1).join(" ");
            msg.channel.send("Currency icon updated.");
            await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
            await ougi.backup(database.settings.file, channels.settings);
        }
        break;
        case "xp": {
            settingsOBJ.economy[msg.guild.id].xp = arguments.slice(1).join(" ");
            msg.channel.send("XP icon updated.");
            await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
            await ougi.backup(database.settings.file, channels.settings);
        }
        break;
        default:
            msg.channel.send("Please specify what icon you wish to update.")
        break;
    }
}