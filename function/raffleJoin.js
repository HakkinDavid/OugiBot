module.exports = async function (arguments, msg) {
    if (!(await ougi.guildCheck(msg))) return;

    const messageId = msg.reference?.messageId;
    if (!messageId) return;

    const raffleIdx = rafflesOBJ[msg.guildId].ongoingRaffles?.findIndex(r => r.messageId == messageId);
    if (raffleIdx === -1) {
        ougi.globalLog(`Raffle join failed: raffleIdx not found for messageId: ${messageId}`);
        return;
    }
    if (rafflesOBJ[msg.guildId].ongoingRaffles[raffleIdx].config.endsAt < Date.now()) {
        ougi.globalLog(`Raffle join failed: raffle has ended for raffleIdx: ${raffleIdx}, messageId: ${messageId}`);
        return;
    }

    let participantName = settingsOBJ.nicknames?.[msg.guildId]?.[msg.author.id];
    if (!participantName) {
        participantName = msg.author.username;
    }

    const participantIdx = rafflesOBJ[msg.guildId].ongoingRaffles[raffleIdx].participants.findIndex(p => p.name.toLowerCase() == participantName.toLowerCase());
    if (
        participantIdx === -1 ||
        rafflesOBJ[msg.guildId].ongoingRaffles[raffleIdx].participants[participantIdx].confirmed
    ) {
        ougi.globalLog(`Raffle join failed: participantIdx not found or already confirmed. participantIdx: ${participantIdx}, confirmed: ${
            participantIdx !== -1 ? rafflesOBJ[msg.guildId].ongoingRaffles[raffleIdx].participants[participantIdx].confirmed : 'N/A'
        }, participantName: ${participantName}`);
        return;
    }

    rafflesOBJ[msg.guildId].ongoingRaffles[raffleIdx].participants[participantIdx].confirmed = true;
    ougi.globalLog(`Raffle join: participant confirmed set to true for participantIdx: ${participantIdx}, participantName: ${participantName}`);
    rafflesOBJ[msg.guildId].ongoingRaffles[raffleIdx].participants[participantIdx].id = msg.author.id;
    await ougi.writeFile(database.raffles.file, JSON.stringify(rafflesOBJ, null, 4), console.error);

    await ougi.backup(database.raffles.file, channels.raffles);
    
    const channel = msg.guild.channels.cache.get(rafflesOBJ[msg.guildId].ongoingRaffles[raffleIdx].config.channelId);
    if (!channel) {
        ougi.globalLog(`Raffle join failed: channel not found for channelId: ${rafflesOBJ[msg.guildId].ongoingRaffles[raffleIdx].config.channelId}`);
        return;
    }
    try {
        const originalMessage = await channel.messages.fetch(messageId);
        await originalMessage.edit({ content: `${msg.author} has joined!`, embeds: [rafflesOBJ[msg.guildId].ongoingRaffles[raffleIdx].embed] });
    } catch (error) {
        ougi.globalLog(`Raffle joining failed for raffle ${messageId}: ${error}`);
    }
}