module.exports =

    function (action, msg, options) {
        if (action === 'init' && ougi.isAdmin(msg) || !settingsOBJ.economy.hasOwnProperty(msg.guildId)) {
            settingsOBJ.economy[msg.guildId] = {
                users: {},
                multiplier: 1,
                channels: [],
                shop: {},
                levels: {},
                badges: {},
                currency: "$",
                xp: "XP",
                cooldown: 10
            }
        }
        if (!settingsOBJ.economy[msg.guildId].users.hasOwnProperty(msg.author.id) || action === 'reset_user') {
            settingsOBJ.economy[msg.guildId].users[msg.author.id] = {
                money: 0,
                inventory: [],
                level: 0,
                xp: 0,
                badges: [],
                worked: 0
            };
            if (action === 'reset_user') return;
        }
        if (settingsOBJ.economy[msg.guildId].disabled) return;
        switch (action) {
            case 'xp': {
                let experience = Math.floor(msg.content.length / (Math.random() * settingsOBJ.economy[msg.guildId].multiplier + 1));
                settingsOBJ.economy[msg.guildId].users[msg.author.id].xp += experience;
                let nextLevel = 512 * (settingsOBJ.economy[msg.guildId].users[msg.author.id].level + 1);
                while (settingsOBJ.economy[msg.guildId].users[msg.author.id].xp >= nextLevel) {
                    settingsOBJ.economy[msg.guildId].users[msg.author.id].xp -= nextLevel;
                    settingsOBJ.economy[msg.guildId].users[msg.author.id].level++;
                    let income = Math.floor(Math.random() * nextLevel / 25);
                    settingsOBJ.economy[msg.guildId].users[msg.author.id].money += income;
                    ougi.guildLog(msg, { type: 'economy', income, reason: 'levelup' });
                    nextLevel = 512 * (settingsOBJ.economy[msg.guildId].users[msg.author.id].level + 1);
                }
            }
                break;
            case 'add': {
                let income = Math.floor(Math.random() * settingsOBJ.economy[msg.guildId].multiplier * 10 + (settingsOBJ.economy[msg.guildId].users[msg.author.id].xp / 100 * settingsOBJ.economy[msg.guildId].multiplier));
                settingsOBJ.economy[msg.guildId].users[msg.author.id].money += income;
                ougi.guildLog(msg, { type: 'economy', income, reason: options.reason });
                return income;
            }
                break;
            case 'remove': {
                let income = -Math.floor(Math.random() * settingsOBJ.economy[msg.guildId].multiplier * (settingsOBJ.economy[msg.guildId].users[msg.author.id].xp / 100 + settingsOBJ.economy[msg.guildId].multiplier));
                settingsOBJ.economy[msg.guildId].users[msg.author.id].money += income;
                ougi.guildLog(msg, { type: 'economy', income, reason: options.reason });
                return income;
            }
                break;
        }
    }