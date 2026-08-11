module.exports =

    async function (arguments, msg) {
        if (!(await ougi.guildCheck(msg))) return;

        if (!ougi.isAdmin(msg)) {
            msg.channel.send("You must be an administrator to perform this action.");
            return
        }

        switch (arguments[0]) {
            case "currency": {
                settingsOBJ.economy[msg.guildId].currency = arguments.slice(1).join(" ");
                msg.channel.send("Currency icon updated.");
                ougi.db().saveKV('settings', 'kv', 'settingsOBJ', settingsOBJ);
            }
                break;
            case "xp": {
                settingsOBJ.economy[msg.guildId].xp = arguments.slice(1).join(" ");
                msg.channel.send("XP icon updated.");
                ougi.db().saveKV('settings', 'kv', 'settingsOBJ', settingsOBJ);
            }
                break;
            default:
                msg.channel.send("Please specify what icon you wish to update.")
                break;
        }
    }