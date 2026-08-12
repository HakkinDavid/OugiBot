module.exports =

async function (action, msg, options) {
    if (!(await ougi.guildCheck(msg))) return;

    if (!ougi.isAdmin(msg)) {
        msg.channel.send("You must be an administrator to perform this action.");
        return;
    }

    const db = ougi.db();
    const guildId = msg.guildId;

    switch (action) {
        case 'channel': {
            const guildEco = db.getGuildEconomy(guildId);
            if (guildEco.disabled) {
                msg.channel.send("You must enable economy first.\n> ougi economy enable");
                return;
            }
            let expChannels = [];

            if (options.length > 1) {
                for (let i = 1; options.length > i; i++) {
                    if (options[i].startsWith("<#") && options[i].endsWith(">")) {
                        let channelMention = options[i].slice(2, -1);
                        if (!msg.guild.channels.cache.has(channelMention)) {
                            msg.channel.send("Huh? Looks like you're using this command wrong. Refer to the following command for help.\n> ougi help xp-channel");
                            return;
                        }
                        expChannels.push(channelMention);
                    }
                    else if (options[i] === 'all') {
                        expChannels = guildEco.channels;
                        break;
                    }
                }
            } else {
                msg.channel.send("Huh? Looks like you're using this command wrong. Refer to the following command for help.\n> ougi help xp-channel");
                return;
            }

            switch (options[0]) {
                case 'add':
                    guildEco.channels.push(...expChannels);
                    db.saveGuildEconomy(guildId, guildEco);
                    msg.channel.send("I will start giving XP to users in these channels.");
                    break;
                case 'remove':
                    guildEco.channels = guildEco.channels.filter(ch => !expChannels.includes(ch));
                    db.saveGuildEconomy(guildId, guildEco);
                    msg.channel.send("I won't give XP to users in these channels.");
                    break;
                default:
                    msg.channel.send("You seem to be using this command wrong.");
                    break;
            }
            break;
        }
        case 'economy': {
            switch (options[0]) {
                case 'enable': {
                    const guildEco = db.getGuildEconomy(guildId);
                    if (!guildEco.disabled) {
                        msg.channel.send("Already enabled.");
                        return;
                    }
                    guildEco.disabled = false;
                    db.saveGuildEconomy(guildId, guildEco);
                    msg.channel.send("Economy enabled.");
                    break;
                }
                case 'disable': {
                    const guildEco = db.getGuildEconomy(guildId);
                    if (guildEco.disabled) {
                        msg.channel.send("Already disabled.");
                        return;
                    }
                    guildEco.disabled = true;
                    db.saveGuildEconomy(guildId, guildEco);
                    msg.channel.send("Economy disabled.");
                    break;
                }
                case 'reset': {
                    db.saveGuildEconomy(guildId, {
                        multiplier: 1, channels: [], currency: '$',
                        xp_label: 'XP', cooldown: 10, disabled: false
                    });
                    msg.channel.send("Economy reset.");
                    break;
                }
                case 'cooldown': {
                    const guildEco = db.getGuildEconomy(guildId);
                    guildEco.cooldown = parseInt(options[1], 10) || 10;
                    db.saveGuildEconomy(guildId, guildEco);
                    msg.channel.send("Cooldown for economy commands set.");
                    break;
                }
                default:
                    msg.channel.send("You seem to be using this command wrong.");
                    break;
            }
            break;
        }
        default:
            msg.channel.send("You seem to be using this command wrong.");
            break;
    }
}