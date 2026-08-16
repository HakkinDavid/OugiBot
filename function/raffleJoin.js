module.exports = async function (arguments, msg) {
    if (!(await ougi.guildCheck(msg))) return;

    const messageId = msg.reference?.messageId;
    if (!messageId) return;

    const guildRaffles = ougi.db().getGuildRaffles(msg.guildId);
    if (!guildRaffles) return;

    const raffleIdx = guildRaffles.ongoingRaffles?.findIndex(r => r.messageId == messageId);
    if (raffleIdx === undefined || raffleIdx === -1) {
        ougi.globalLog(`Raffle join failed: raffleIdx not found for messageId: ${messageId}`);
        return;
    }
    const currentRaffle = guildRaffles.ongoingRaffles[raffleIdx];
    if (currentRaffle.config.endsAt < Date.now()) {
        ougi.globalLog(`Raffle join failed: raffle has ended for raffleIdx: ${raffleIdx}, messageId: ${messageId}`);
        return;
    }

    const nicknames = ougi.db().getNicknames(msg.guildId);
    let participantName = nicknames[msg.author.id] || msg.author.username;

    const participantIdx = currentRaffle.participants.findIndex(p => p.name.toLowerCase() == participantName.toLowerCase());
    if (
        participantIdx === -1 ||
        currentRaffle.participants[participantIdx].confirmed
    ) {
        ougi.globalLog(`Raffle join failed: participantIdx not found or already confirmed. participantIdx: ${participantIdx}, confirmed: ${
            participantIdx !== -1 ? currentRaffle.participants[participantIdx].confirmed : 'N/A'
        }, participantName: ${participantName}`);
        return;
    }

    currentRaffle.participants[participantIdx].confirmed = true;
    ougi.globalLog(`Raffle join: participant confirmed set to true for participantIdx: ${participantIdx}, participantName: ${participantName}`);
    currentRaffle.participants[participantIdx].id = msg.author.id;
    ougi.db().saveRaffles();
    
    const channel = msg.guild.channels.cache.get(currentRaffle.config.channelId);
    if (!channel) {
        ougi.globalLog(`Raffle join failed: channel not found for channelId: ${currentRaffle.config.channelId}`);
        return;
    }
    try {
        const originalMessage = await channel.messages.fetch(messageId);
        const joinedTemplate = await ougi.text(msg, "raffle_userJoined");
        await originalMessage.edit({ content: joinedTemplate.replace(/{user}/g, msg.author.toString()), embeds: [currentRaffle.embed] });
    } catch (error) {
        ougi.globalLog(`Raffle joining failed for raffle ${messageId}: ${error}`);
    }
}