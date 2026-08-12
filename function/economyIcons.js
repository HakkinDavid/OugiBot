module.exports =

    async function (arguments, msg) {
        if (!(await ougi.guildCheck(msg))) return;

        if (!ougi.isAdmin(msg)) {
            msg.channel.send("You must be an administrator to perform this action.");
            return;
        }

        const db = ougi.db();
        const guildEco = db.getGuildEconomy(msg.guildId);

        switch (arguments[0]) {
            case "currency":
                guildEco.currency = arguments.slice(1).join(" ");
                db.saveGuildEconomy(msg.guildId, guildEco);
                msg.channel.send("Currency icon updated.");
                break;
            case "xp":
                guildEco.xp_label = arguments.slice(1).join(" ");
                db.saveGuildEconomy(msg.guildId, guildEco);
                msg.channel.send("XP icon updated.");
                break;
            default:
                msg.channel.send("Please specify what icon you wish to update.");
                break;
        }
    }