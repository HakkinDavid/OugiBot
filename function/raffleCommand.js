module.exports = async function (arguments, msg) {
    if (!(await ougi.guildCheck(msg))) return;
    if (!(await ougi.adminCheck(msg))) return;

    const { data: guildRaffles, isNew } = ougi.db().getOrCreateGuildRaffles(msg.guildId);
    if (isNew) {
        msg.channel.send("Inited raffles configuration for this server. Provisional license expires in 1 hour.");
    }

    if (guildRaffles.licensedUntil < Date.now()) {
        msg.channel.send("Your raffles license has expired. Renew by supporting the bot on Patreon or PayPal.\n`ougi patreon`");
        return;
    }

    // Handle preset list setting
    if (arguments[0] == "list") {
        if (arguments[1] == "clear") {
            guildRaffles.presetList = null;
            msg.channel.send("Preset participant list has been cleared for this server.");
        }
        else {
            // Extract the remainder of the message content after the command
            let afterListCmd = msg.content.slice(msg.content.toLowerCase().indexOf("raffle") + "raffle".length).trim();
            afterListCmd = afterListCmd.slice(afterListCmd.toLowerCase().indexOf("list") + "list".length).trim();
            if (!afterListCmd) {
                msg.channel.send("Usage: `ougi raffle list <participant nicknames, each with a number of entries>` or `ougi raffle list clear`.");
                return;
            }
            guildRaffles.presetList = afterListCmd;
            msg.channel.send("Preset participant list has been set for this server.");
        }
        ougi.db().saveRaffles();
        return;
    }
    if (arguments[0] == "clear") {
        guildRaffles.ongoingRaffles = [];
        msg.channel.send("Raffles have been cleared. You are allowed to run " + guildRaffles.allowedConcurrentRaffles + " concurrent raffles.");
        ougi.db().saveRaffles();
        return;
    }

    if (guildRaffles.ongoingRaffles.length >= guildRaffles.allowedConcurrentRaffles) {
        msg.channel.send(`Your current license supports up to ${guildRaffles.allowedConcurrentRaffles} concurrent raffles. Clear them out with \`ougi raffle clear\` or consider upgrading your plan.`);
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
        msg.channel.send("Error: Missing required fields. Please provide at least `::list` (participants) and `::title`.\nIf you want to set a preset list, use `ougi raffle list <your list>`.");
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
        msg.channel.send(`Participant count exceeds the allowed limit of ${guildRaffles.allowedParticipants}.`);
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
                msg.channel.send("Invalid duration format. Please specify duration as `XXh YYm` or `YYm` (e.g., `1h 30m` or `45m`).");
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
            { name: 'Duration', value: slices.duration || `${durationMinutes}m`, inline: true },
            { name: 'Winners', value: winnersCount.toString(), inline: true },
            { name: 'Participants', value: participants.length.toString(), inline: true },
        ],
        description: mention ? `${mention}` : '',
        color: 0x00FF00,
        footer: {
            text: "Cryptosecure raffles powered by Ougi. Bring us to your Discord!"
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