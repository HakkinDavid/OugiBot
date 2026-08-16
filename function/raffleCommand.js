module.exports = async function (arguments, msg) {
    if (!(await ougi.guildCheck(msg))) return;
    if (!(await ougi.adminCheck(msg))) return;

    const { data: guildRaffles, isNew } = ougi.db().getOrCreateGuildRaffles(msg.guildId);
    if (isNew) {
        msg.channel.send(await ougi.text({ msg, stringID: "raffle_licenseInited" }));
    }

    if (guildRaffles.licensedUntil < Date.now()) {
        msg.channel.send(await ougi.text({
            msg,
            stringID: "raffle_licenseExpired",
            values: { command: "`ougi patreon`" }
        }));
        return;
    }

    // Handle preset list setting
    if (arguments[0] == "list") {
        if (arguments[1] == "clear") {
            guildRaffles.presetList = null;
            msg.channel.send(await ougi.text({ msg, stringID: "raffle_listCleared" }));
        }
        else {
            // Extract the remainder of the message content after the command
            let afterListCmd = msg.content.slice(msg.content.toLowerCase().indexOf("raffle") + "raffle".length).trim();
            afterListCmd = afterListCmd.slice(afterListCmd.toLowerCase().indexOf("list") + "list".length).trim();
            if (!afterListCmd) {
                msg.channel.send(await ougi.text({
                    msg,
                    stringID: "raffle_listUsage",
                    values: {
                        usage1: "`ougi raffle list <participant nicknames, each with a number of entries>`",
                        usage2: "`ougi raffle list clear`"
                    }
                }));
                return;
            }
            guildRaffles.presetList = afterListCmd;
            msg.channel.send(await ougi.text({ msg, stringID: "raffle_listSet" }));
        }
        ougi.db().saveRaffles();
        return;
    }
    if (arguments[0] == "clear") {
        guildRaffles.ongoingRaffles = [];
        msg.channel.send(await ougi.text({
            msg,
            stringID: "raffle_cleared",
            values: { allowed: guildRaffles.allowedConcurrentRaffles }
        }));
        ougi.db().saveRaffles();
        return;
    }

    if (guildRaffles.ongoingRaffles.length >= guildRaffles.allowedConcurrentRaffles) {
        msg.channel.send(await ougi.text({
            msg,
            stringID: "raffle_maxConcurrent",
            values: {
                allowed: guildRaffles.allowedConcurrentRaffles,
                command: "`ougi raffle clear`"
            }
        }));
        return;
    }

    // parse slices from message content after command
    const content = msg.content.slice(msg.content.toLowerCase().indexOf("raffle") + "raffle".length).trim();
    const parts = content.split('::').map(s => s.trim());

    // Parse slices into an object keyed by slice name
    const slices = {};
    for (const part of parts) {
        const lines = part.split('\n');
        const key = lines[0].split(/\s/)[0].trim().toLowerCase();

        let value;
        if (lines.length > 1) {
            // Multiline slice
            value = lines.slice(1).join('\n').trim();
        } else {
            // Single-line slice
            const spaceIdx = lines[0].indexOf(' ');
            value = spaceIdx !== -1 ? lines[0].slice(spaceIdx + 1).trim() : '';
        }

        slices[key] = value;
    }

    // Use presetList if ::list is not provided
    let listStr = slices.list;
    if ((!listStr || !listStr.trim()) && guildRaffles.presetList) {
        listStr = guildRaffles.presetList;
    }
    // Validation: require at least a list and ::title
    if ((!listStr || !listStr.trim()) || !slices.title) {
        msg.channel.send(await ougi.text({
            msg,
            stringID: "raffle_missingFields",
            values: {
                listOption: "`::list`",
                titleOption: "`::title`",
                command: "`ougi raffle list <your list>`"
            }
        }));
        return;
    }

    // parse participants list
    let participants = [];
    if (listStr) {
        const lines = listStr.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        for (const line of lines) {
            // expect format: name weight
            const parts = line.split(/\s+/);
            if (parts.length >= 2) {
                const weight = parseInt(parts[parts.length - 1], 10);
                if (!isNaN(weight)) {
                    const name = parts.slice(0, parts.length - 1).join(' ');
                    participants.push({ name, weight, confirmed: false, id: null });
                }
            }
        }
    }

    if (participants.length > guildRaffles.allowedParticipants) {
        msg.channel.send(await ougi.text({
            msg,
            stringID: "raffle_participantLimit",
            values: { allowed: guildRaffles.allowedParticipants }
        }));
        return;
    }

    const title = slices.title || 'Raffle';

    let durationMinutes = 2;
    if (slices.duration) {
        const durationStr = slices.duration.toLowerCase();
        let match = durationStr.match(/^(\d+)h\s*(\d+)?m?$/);
        if (match) {
            const hours = parseInt(match[1], 10);
            const minutes = match[2] ? parseInt(match[2], 10) : 0;
            durationMinutes = hours * 60 + minutes;
        } else {
            match = durationStr.match(/^(\d+)m$/);
            if (match) {
                durationMinutes = parseInt(match[1], 10);
            } else {
                // Invalid duration format
                msg.channel.send(await ougi.text({
                    msg,
                    stringID: "raffle_invalidDuration",
                    values: {
                        format1: "`XXh YYm`",
                        format2: "`YYm`",
                        example1: "`1h 30m`",
                        example2: "`45m`"
                    }
                }));
                return;
            }
        }
    }

    const winnersCount = parseInt(slices.winners) || 1;
    const mention = slices.mention || '';
    let targetChannel = msg.channel;
    if (slices.channel) {
        const channelId = slices.channel.replace(/[<#>]/g, '');
        const found = msg.guild.channels.cache.get(channelId);
        if (found) targetChannel = found;
    }

    const embed = {
        title: title,
        fields: [
            { name: await ougi.text({ msg, stringID: "raffle_fieldDuration" }), value: slices.duration || `${durationMinutes}m`, inline: true },
            { name: await ougi.text({ msg, stringID: "raffle_fieldWinners" }), value: winnersCount.toString(), inline: true },
            { name: await ougi.text({ msg, stringID: "raffle_fieldParticipants" }), value: participants.length.toString(), inline: true },
        ],
        description: mention ? `${mention}` : '',
        color: 0x00FF00,
        footer: {
            text: await ougi.text({ msg, stringID: "raffle_footer" })
        }
    };

    const sentMsg = await targetChannel.send({ embeds: [embed] });

    guildRaffles.ongoingRaffles.push({
        messageId: sentMsg.id,
        embed: embed,
        participants,
        config: {
            title,
            duration: durationMinutes,
            winnersCount,
            mention,
            channelId: targetChannel.id,
            endsAt: Date.now() + durationMinutes * 60 * 1000,
        },
        winners: null,
        finished: false
    });

    ougi.db().saveRaffles();
}