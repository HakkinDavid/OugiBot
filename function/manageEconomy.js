module.exports =

async function (action, msg, options) {
    if (!(await ougi.guildCheck(msg))) return;

    if (!ougi.isAdmin(msg)) {
        msg.channel.send(await ougi.text({ msg, stringID: "economy_adminOnly" }));
        return;
    }

    const db = ougi.db();
    const guildId = msg.guildId;

    switch (action) {
        case 'channel': {
            const guildEco = db.getGuildEconomy(guildId);
            if (guildEco.disabled) {
                msg.channel.send(await ougi.text({ msg, stringID: "manageEco_enableFirst", values: { command: "ougi economy enable" } }));
                return;
            }
            let expChannels = [];

            if (options.length > 1) {
                for (let i = 1; options.length > i; i++) {
                    if (options[i].startsWith("<#") && options[i].endsWith(">")) {
                        let channelMention = options[i].slice(2, -1);
                        if (!msg.guild.channels.cache.has(channelMention)) {
                            msg.channel.send(await ougi.text({ msg, stringID: "manageEco_xpChannelHelp", values: { command: "ougi help xp-channel" } }));
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
                msg.channel.send(await ougi.text({ msg, stringID: "manageEco_xpChannelHelp", values: { command: "ougi help xp-channel" } }));
                return;
            }

            switch (options[0]) {
                case 'add':
                    guildEco.channels.push(...expChannels);
                    db.saveGuildEconomy(guildId, guildEco);
                    msg.channel.send(await ougi.text({ msg, stringID: "manageEco_xpChannelsAdd" }));
                    break;
                case 'remove':
                    guildEco.channels = guildEco.channels.filter(ch => !expChannels.includes(ch));
                    db.saveGuildEconomy(guildId, guildEco);
                    msg.channel.send(await ougi.text({ msg, stringID: "manageEco_xpChannelsRemove" }));
                    break;
                default:
                    msg.channel.send(await ougi.text({ msg, stringID: "manageEco_commandWrong" }));
                    break;
            }
            break;
        }
        case 'economy': {
            switch (options[0]) {
                case 'enable': {
                    const guildEco = db.getGuildEconomy(guildId);
                    if (!guildEco.disabled) {
                        msg.channel.send(await ougi.text({ msg, stringID: "manageEco_alreadyEnabled" }));
                        return;
                    }
                    guildEco.disabled = false;
                    db.saveGuildEconomy(guildId, guildEco);
                    msg.channel.send(await ougi.text({ msg, stringID: "manageEco_enabled" }));
                    break;
                }
                case 'disable': {
                    const guildEco = db.getGuildEconomy(guildId);
                    if (guildEco.disabled) {
                        msg.channel.send(await ougi.text({ msg, stringID: "manageEco_alreadyDisabled" }));
                        return;
                    }
                    guildEco.disabled = true;
                    db.saveGuildEconomy(guildId, guildEco);
                    msg.channel.send(await ougi.text({ msg, stringID: "manageEco_disabled" }));
                    break;
                }
                case 'reset': {
                    db.saveGuildEconomy(guildId, {
                        multiplier: 1, channels: [], currency: '$',
                        xp_label: 'XP', cooldown: 10, disabled: false
                    });
                    msg.channel.send(await ougi.text({ msg, stringID: "manageEco_reset" }));
                    break;
                }
                case 'cooldown': {
                    const guildEco = db.getGuildEconomy(guildId);
                    guildEco.cooldown = parseInt(options[1], 10) || 10;
                    db.saveGuildEconomy(guildId, guildEco);
                    msg.channel.send(await ougi.text({ msg, stringID: "manageEco_cooldownSet" }));
                    break;
                }
                default:
                    msg.channel.send(await ougi.text({ msg, stringID: "manageEco_commandWrong" }));
                    break;
            }
            break;
        }
        default:
            msg.channel.send(await ougi.text({ msg, stringID: "manageEco_commandWrong" }));
            break;
    }
}