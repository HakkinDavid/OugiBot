module.exports =

function (action, msg, options) {
    let guildID = msg.guild.id;
    if (action === 'init' && ougi.isAdmin(msg) || !settingsOBJ.economy.hasOwnProperty(guildID)) {
        settingsOBJ.economy[guildID] = {
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
    if (!settingsOBJ.economy[guildID].users.hasOwnProperty(msg.author.id)) {
        settingsOBJ.economy[guildID].users[msg.author.id] = {
            money: 0,
            inventory: [],
            level: 0,
            xp: 0,
            badges: [],
            worked: 0
        };
    }
    switch (action) {
        case 'xp': {
            let experience = Math.floor(msg.content.length/(Math.random()*settingsOBJ.economy[guildID].multiplier + 1));
            settingsOBJ.economy[guildID].users[msg.author.id].xp += experience;
            let nextLevel = 512 * (settingsOBJ.economy[guildID].users[msg.author.id].level + 1);
            while (settingsOBJ.economy[guildID].users[msg.author.id].xp >= nextLevel) {
                settingsOBJ.economy[guildID].users[msg.author.id].xp -= nextLevel;
                settingsOBJ.economy[guildID].users[msg.author.id].level++;
                let income = Math.floor(Math.random()*nextLevel/25);
                settingsOBJ.economy[guildID].users[msg.author.id].money += income;
                ougi.guildLog(msg, { type: 'economy', income, reason: 'levelup' });
                nextLevel = 512 * (settingsOBJ.economy[guildID].users[msg.author.id].level + 1);
            }
        }
        break;
        case 'add': {
            let income = Math.floor(Math.random()*settingsOBJ.economy[guildID].multiplier*10+(settingsOBJ.economy[guildID].users[msg.author.id].xp/100 * settingsOBJ.economy[guildID].multiplier));
            settingsOBJ.economy[guildID].users[msg.author.id].money += income;
            ougi.guildLog(msg, { type: 'economy', income, reason: options.reason });
            return income;
        }
        break;
        case 'remove': {
            let income = -Math.floor(Math.random()*settingsOBJ.economy[guildID].multiplier*(settingsOBJ.economy[guildID].users[msg.author.id].xp/100 + settingsOBJ.economy[guildID].multiplier));
            settingsOBJ.economy[guildID].users[msg.author.id].money += income;
            ougi.guildLog(msg, { type: 'economy', income, reason: options.reason });
            return income;
        }
        break;
    }
}