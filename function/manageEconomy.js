module.exports =

async function (action, msg, options) {
    if (!(await ougi.guildCheck(msg))) return;


    if (!ougi.isAdmin(msg)) {
        msg.channel.send("You must be an administrator to perform this action.");
        return
    }

    switch (action) {
        case 'channel': {
            if (!settingsOBJ.economy.hasOwnProperty(msg.guildId)) {
                msg.channel.send("You must enable economy first.\n> ougi economy enable");
                return
            }
            let expChannels = [];

            if (options.length > 1) {
                for (i=1; options.length > i; i++) {
                    if (options[i].startsWith("<#") && options[i].endsWith(">")) {
                        let channelMention = options[i];
                        channelMention = channelMention.slice(2, -1);
                        if (!msg.guild.channels.cache.has(channelMention)) {
                            msg.channel.send("Huh? Looks like you're using this command wrong. Refer to the following command for help.\n> ougi help xp-channel");
                            return
                        }
                        expChannels.push(channelMention);
                    }
                    else if (options[i] === 'all') {
                        expChannels = settingsOBJ.economy[msg.guildId].channels;
                        break;
                    }
                }
            }
            else {
                msg.channel.send("Huh? Looks like you're using this command wrong. Refer to the following command for help.\n> ougi help xp-channel");
                return
            }

            switch (options[0]) {
                case 'add': {
                    settingsOBJ.economy[msg.guildId].channels.push(... expChannels);
                    msg.channel.send("I will start giving XP to users in these channels.");
                    ougi.db().saveKV('settings', 'kv', 'settingsOBJ', settingsOBJ);
                }
                break;
                case 'remove': {
                    settingsOBJ.economy[msg.guildId].channels = settingsOBJ.economy[msg.guildId].channels.filter(channel => !expChannels.includes(channel));
                    msg.channel.send("I won't give XP to users in these channels.");
                    ougi.db().saveKV('settings', 'kv', 'settingsOBJ', settingsOBJ);
                }
                break;
                default:
                    msg.channel.send("You seem to be using this command wrong.");
                break;
            }
        }
        break;
        case 'economy': {
            switch (options[0]) {
                case 'enable': {
                    if (settingsOBJ.economy.hasOwnProperty(msg.guildId) && !settingsOBJ.economy[msg.guildId].disabled) {
                        msg.channel.send("Already enabled.");
                        return
                    }
                    settingsOBJ.economy[msg.guildId] ? settingsOBJ.economy[msg.guildId].disabled = false : ougi.economy('init', msg);
                    msg.channel.send("Economy enabled.");
                    ougi.db().saveKV('settings', 'kv', 'settingsOBJ', settingsOBJ);
                }
                break;
                case 'disable': {
                    if (!settingsOBJ.economy.hasOwnProperty(msg.guildId) || settingsOBJ.economy[msg.guildId].disabled) {
                        msg.channel.send("Already disabled.");
                        return
                    }
                    settingsOBJ.economy[msg.guildId].disabled = true;
                    msg.channel.send("Economy disabled.");
                    ougi.db().saveKV('settings', 'kv', 'settingsOBJ', settingsOBJ);
                }
                break;
                case 'reset': {
                    ougi.economy('init', msg);
                    msg.channel.send("Economy reseted.");
                    ougi.db().saveKV('settings', 'kv', 'settingsOBJ', settingsOBJ);
                }
                break;
                case 'cooldown':
                    settingsOBJ.economy[msg.guildId].cooldown = options[1];
                    msg.channel.send("Cooldown for economy commands set.");
                    ougi.db().saveKV('settings', 'kv', 'settingsOBJ', settingsOBJ);
                break;
                default:
                    msg.channel.send("You seem to be using this command wrong.");
                break;
            }
        }
        break;
        default:
            msg.channel.send("You seem to be using this command wrong.");
        break;
    }
}