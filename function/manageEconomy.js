module.exports =

async function (action, msg, options) {
    if (msg.channel.type !== Discord.ChannelType.GuildText) {
        msg.channel.send(await ougi.text(msg, "mustGuild"));
        return
    }

    let guildID = msg.guild.id;

    if (!ougi.isAdmin(msg)) {
        msg.channel.send("You must be an administrator to perform this action.");
        return
    }

    switch (action) {
        case 'channel': {
            if (!settingsOBJ.economy.hasOwnProperty(guildID)) {
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
                        expChannels = settingsOBJ.economy[guildID].channels;
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
                    settingsOBJ.economy[guildID].channels.push(... expChannels);
                    msg.channel.send("I will start giving XP to users in these channels.");
                    await ougi.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);
                    await ougi.backup('./settings.txt', settingsChannel);
                }
                break;
                case 'remove': {
                    settingsOBJ.economy[guildID].channels = settingsOBJ.economy[guildID].channels.filter(channel => !expChannels.includes(channel));
                    msg.channel.send("I won't give XP to users in these channels.");
                    await ougi.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);
                    await ougi.backup('./settings.txt', settingsChannel);
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
                    if (settingsOBJ.economy.hasOwnProperty(guildID) && !settingsOBJ.economy[guildID].disabled) {
                        msg.channel.send("Already enabled.");
                        return
                    }
                    settingsOBJ.economy[guildID] ? settingsOBJ.economy[guildID].disabled = false : ougi.economy('init', msg);
                    msg.channel.send("Economy enabled.");
                    await ougi.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);
                    await ougi.backup('./settings.txt', settingsChannel);
                }
                break;
                case 'disable': {
                    if (!settingsOBJ.economy.hasOwnProperty(guildID) || settingsOBJ.economy[guildID].disabled) {
                        msg.channel.send("Already disabled.");
                        return
                    }
                    settingsOBJ.economy[guildID].disabled = true;
                    msg.channel.send("Economy disabled.");
                    await ougi.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);
                    await ougi.backup('./settings.txt', settingsChannel);
                }
                break;
                case 'reset': {
                    ougi.economy('init', msg);
                    msg.channel.send("Economy reseted.");
                    await ougi.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);
                    await ougi.backup('./settings.txt', settingsChannel);
                }
                break;
                case 'cooldown':
                    settingsOBJ.economy[guildID].cooldown = options[1];
                    msg.channel.send("Cooldown for economy commands set.");
                    await ougi.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);
                    await ougi.backup('./settings.txt', settingsChannel);
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