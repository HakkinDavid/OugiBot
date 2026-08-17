module.exports = async function (action, msg, options) {
    if (!(await ougi.guildCheck(msg))) return;

    if (!(await ougi.adminCheck(msg))) {
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

            if (options && options.length > 1) {
                for (let i = 1; i < options.length; i++) {
                    const raw = options[i];
                    if (raw.startsWith("<#") && raw.endsWith(">")) {
                        let channelMention = raw.slice(2, -1);
                        if (!msg.guild.channels.cache.has(channelMention)) {
                            msg.channel.send(await ougi.text({ msg, stringID: "manageEco_xpChannelHelp", values: { command: "ougi help xp-channel" } }));
                            return;
                        }
                        expChannels.push(channelMention);
                    } else if (/^\d{17,20}$/.test(raw)) {
                        if (!msg.guild.channels.cache.has(raw)) {
                            msg.channel.send(await ougi.text({ msg, stringID: "manageEco_xpChannelHelp", values: { command: "ougi help xp-channel" } }));
                            return;
                        }
                        expChannels.push(raw);
                    } else if (raw === 'all') {
                        expChannels = [...guildEco.channels];
                        break;
                    }
                }
            } else {
                msg.channel.send(await ougi.text({ msg, stringID: "manageEco_xpChannelHelp", values: { command: "ougi help xp-channel" } }));
                return;
            }

            switch (options[0]) {
                case 'add': {
                    const channelSet = new Set(guildEco.channels);
                    expChannels.forEach(ch => channelSet.add(ch));
                    guildEco.channels = Array.from(channelSet);
                    db.saveGuildEconomy(guildId, guildEco);
                    msg.channel.send(await ougi.text({ msg, stringID: "manageEco_xpChannelsAdd" }));
                    break;
                }
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
            if (!options || options.length === 0) {
                msg.channel.send(await ougi.text({ msg, stringID: "manageEco_commandWrong" }));
                return;
            }
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
                    guildEco.cooldown = Math.max(1, parseInt(options[1], 10) || 10);
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
};