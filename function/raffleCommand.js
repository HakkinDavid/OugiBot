module.exports = async function (arguments, msg) {
    if (!ougi.guildCheck(msg)) return;
    if (!ougi.adminCheck(msg)) return;

    if (!rafflesOBJ) return;
    if (!rafflesOBJ[msg.guildId]) {
        rafflesOBJ[msg.guildId] = {
            ongoingRaffles: [],
            allowedConcurrentRaffles: 1,
            allowedParticipants: 100,
            licensedUntil: Date.now() + 1 * 60 * 60 * 1000,
        };
        msg.channel.send("Inited raffles configuration for this server. Provisional license expires in 1 hour.");
    }

    if (rafflesOBJ[msg.guildId].licensedUntil < Date.now()) {
        msg.channel.send("Your raffles license has expired. Renew by supporting the bot on Patreon or PayPal.\n`ougi patreon`");
        return;
    }

    if (arguments[0] == "clear") {
        rafflesOBJ[msg.guildId].ongoingRaffles = [];
        msg.channel.send("Raffles have been cleared. You are allowed to run " + rafflesOBJ[msg.guildId].allowedConcurrentRaffles + " concurrent raffles.");
        await ougi.writeFile(database.raffles.file, JSON.stringify(rafflesOBJ, null, 4), console.error);
        await ougi.backup(database.raffles.file, channels.raffles);
        return;
    }

    if (rafflesOBJ[msg.guildId].ongoingRaffles.length >= rafflesOBJ[msg.guildId].allowedConcurrentRaffles) {
        msg.channel.send(`Your current license supports up to ${rafflesOBJ[msg.guildId].allowedConcurrentRaffles} concurrent raffles. Clear them out with \`ougi raffle clear\` or consider upgrading your plan.`);
        return;
    }

    // parse slices from message content after command
    const content = msg.content.slice(msg.content.toLowerCase().indexOf("raffle") + "raffle".length).trim().toLowerCase();
    const parts = content.split('::').map(s => s.trim());

    // Parse slices into an object keyed by slice name
    const slices = {};
    for (const part of parts) {
        const lines = part.split('\n');
        const key = lines[0].trim().toLowerCase();

        let value;
        if (lines.length > 1) {
            // Multiline slice
            value = lines.slice(1).join('\n').trim();
        } else {
            // Single-line slice
            const spaceIdx = part.indexOf(' ');
            value = spaceIdx !== -1 ? part.slice(spaceIdx + 1).trim() : '';
        }

        slices[key] = value;
    }

    // Validation: require ::list and ::title
    if (!slices.list || !slices.title) {
        msg.channel.send("Error: Missing required fields. Please provide at least `::list` (participants) and `::title`.");
        return;
    }

    // parse participants list
    let participants = [];
    if (slices.list) {
        const lines = slices.list.split('\n').map(l => l.trim()).filter(l => l.length > 0);
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

    if (participants.length > rafflesOBJ[msg.guildId].allowedParticipants) {
        msg.channel.send(`Participant count exceeds the allowed limit of ${rafflesOBJ[msg.guildId].allowedParticipants}.`);
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
            { name: 'Duration', value: slices.duration, inline: true },
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

    rafflesOBJ[msg.guildId].ongoingRaffles.push({
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

    await ougi.writeFile(database.raffles.file, JSON.stringify(rafflesOBJ, null, 4), console.error);
    await ougi.backup(database.raffles.file, channels.raffles);
}