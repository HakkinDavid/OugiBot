module.exports = async function (arguments, msg) {
    if (!(await ougi.guildCheck(msg))) return;

    if (!(await ougi.adminCheck(msg))) {
        return;
    }

    const db = ougi.db();
    const guildEco = db.getGuildEconomy(msg.guildId);

    switch (arguments[0]) {
        case "currency":
            guildEco.currency = arguments.slice(1).join(" ").trim() || '$';
            db.saveGuildEconomy(msg.guildId, guildEco);
            msg.channel.send(await ougi.text({ msg, stringID: "economy_currencyUpdated" }));
            break;
        case "xp":
            guildEco.xp_label = arguments.slice(1).join(" ").trim() || 'XP';
            db.saveGuildEconomy(msg.guildId, guildEco);
            msg.channel.send(await ougi.text({ msg, stringID: "economy_xpUpdated" }));
            break;
        default:
            msg.channel.send(await ougi.text({ msg, stringID: "economy_specifyIcon" }));
            break;
    }
};