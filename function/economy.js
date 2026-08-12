module.exports =

    function (action, msg, options) {
        const db = ougi.db();
        const guildId = msg.guildId;
        const userId = msg.author.id;

        // Ensure guild economy config exists
        const guildEco = db.getGuildEconomy(guildId);

        if (action === 'init' && ougi.isAdmin(msg)) {
            // Re-initialize guild economy to defaults
            db.saveGuildEconomy(guildId, {
                multiplier: 1, channels: [], currency: '$',
                xp_label: 'XP', cooldown: 10, disabled: false
            });
            return;
        }

        if (guildEco.disabled) return;

        if (action === 'reset_user') {
            db.saveUser(guildId, userId, { money: 0, xp: 0, level: 0, worked: 0, last_daily: 0 });
            return;
        }

        // Ensure user row exists
        const user = db.getUser(guildId, userId);

        switch (action) {
            case 'xp': {
                let experience = Math.floor(msg.content.length / (Math.random() * guildEco.multiplier + 1));
                user.xp += experience;
                let nextLevel = 512 * (user.level + 1);
                while (user.xp >= nextLevel) {
                    user.xp -= nextLevel;
                    user.level++;
                    let income = Math.floor(Math.random() * nextLevel / 25);
                    user.money += income;
                    ougi.guildLog(msg, { type: 'economy', income, reason: 'levelup' });
                    nextLevel = 512 * (user.level + 1);
                }
                db.saveUser(guildId, userId, user);
                break;
            }
            case 'add': {
                let income = Math.floor(Math.random() * guildEco.multiplier * 10 + (user.xp / 100 * guildEco.multiplier));
                user.money += income;
                db.saveUser(guildId, userId, user);
                ougi.guildLog(msg, { type: 'economy', income, reason: options.reason });
                return income;
            }
            case 'remove': {
                let income = -Math.floor(Math.random() * guildEco.multiplier * (user.xp / 100 + guildEco.multiplier));
                user.money += income;
                db.saveUser(guildId, userId, user);
                ougi.guildLog(msg, { type: 'economy', income, reason: options.reason });
                return income;
            }
        }
    }