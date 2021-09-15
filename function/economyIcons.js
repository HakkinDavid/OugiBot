module.exports =

async function (arguments, msg) {
    if (msg.channel.type !== "text") {
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
            await fs.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);
            await ougi.backup('./settings.txt', settingsChannel);
        }
        break;
        case "xp": {
            settingsOBJ.economy[msg.guild.id].xp = arguments.slice(1).join(" ");
            msg.channel.send("XP icon updated.");
            await fs.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);
            await ougi.backup('./settings.txt', settingsChannel);
        }
        break;
        default:
            msg.channel.send("Please specify what icon you wish to update.")
        break;
    }
}