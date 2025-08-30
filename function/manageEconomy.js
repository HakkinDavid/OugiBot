module.exports =

async function (action, msg, options) {
    if (!ougi.guildCheck(msg)) return;


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
                    await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
                    await ougi.backup(database.settings.file, channels.settings);
                }
                break;
                case 'remove': {
                    settingsOBJ.economy[msg.guildId].channels = settingsOBJ.economy[msg.guildId].channels.filter(channel => !expChannels.includes(channel));
                    msg.channel.send("I won't give XP to users in these channels.");
                    await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
                    await ougi.backup(database.settings.file, channels.settings);
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
                    await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
                    await ougi.backup(database.settings.file, channels.settings);
                }
                break;
                case 'disable': {
                    if (!settingsOBJ.economy.hasOwnProperty(msg.guildId) || settingsOBJ.economy[msg.guildId].disabled) {
                        msg.channel.send("Already disabled.");
                        return
                    }
                    settingsOBJ.economy[msg.guildId].disabled = true;
                    msg.channel.send("Economy disabled.");
                    await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
                    await ougi.backup(database.settings.file, channels.settings);
                }
                break;
                case 'reset': {
                    ougi.economy('init', msg);
                    msg.channel.send("Economy reseted.");
                    await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
                    await ougi.backup(database.settings.file, channels.settings);
                }
                break;
                case 'cooldown':
                    settingsOBJ.economy[msg.guildId].cooldown = options[1];
                    msg.channel.send("Cooldown for economy commands set.");
                    await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
                    await ougi.backup(database.settings.file, channels.settings);
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