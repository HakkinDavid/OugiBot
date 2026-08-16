module.exports =

    async function (arguments, msg) {
        if (!(await ougi.guildCheck(msg))) return;

        if (!ougi.isAdmin(msg)) {
            msg.channel.send(await ougi.text(msg, "economy_adminOnly"));
            return;
        }

        const db = ougi.db();
        const guildEco = db.getGuildEconomy(msg.guildId);

        switch (arguments[0]) {
            case "currency":
                guildEco.currency = arguments.slice(1).join(" ");
                db.saveGuildEconomy(msg.guildId, guildEco);
                msg.channel.send(await ougi.text(msg, "economy_currencyUpdated"));
                break;
            case "xp":
                guildEco.xp_label = arguments.slice(1).join(" ");
                db.saveGuildEconomy(msg.guildId, guildEco);
                msg.channel.send(await ougi.text(msg, "economy_xpUpdated"));
                break;
            default:
                msg.channel.send(await ougi.text(msg, "economy_specifyIcon"));
                break;
        }
    }