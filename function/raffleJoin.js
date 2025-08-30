module.exports = async function (arguments, msg) {
    if (!ougi.guildCheck(msg)) return;

    const messageId = msg.reference?.messageId;
    if (!messageId) return;

    const raffleIdx = rafflesOBJ[msg.guildId].ongoingRaffles?.findIndex(r => r.messageId === messageId);
    if (!raffleIdx || raffleIdx == -1 || rafflesOBJ[msg.guildId].ongoingRaffles[raffleIdx].config.endsAt < Date.now()) return;

    const participantName = settingsOBJ.nicknames?.[msg.guildId]?.[msg.author.id];
    if (!participantName) return;

    const participantIdx = rafflesOBJ[msg.guildId].ongoingRaffles[raffleIdx].participants.findIndex(p => p.name.toLowerCase() === participantName.toLowerCase());
    if (!participantIdx || participantIdx == -1 || rafflesOBJ[msg.guildId].ongoingRaffles[raffleIdx].participants[participantIdx].confirmed) return;

    rafflesOBJ[msg.guildId].ongoingRaffles[raffleIdx].participants[participantIdx].confirmed = true;
    rafflesOBJ[msg.guildId].ongoingRaffles[raffleIdx].participants[participantIdx].id = msg.author.id;
    await ougi.writeFile(database.raffles.file, JSON.stringify(rafflesOBJ, null, 4), console.error);

    await ougi.backup(database.raffles.file, channels.raffles);
    
    const channel = msg.guild.channels.cache.get(rafflesOBJ[msg.guildId].ongoingRaffles[raffleIdx].config.channelId);
    if (!channel) return;
    try {
        const originalMessage = await channel.messages.fetch(messageId);
        await originalMessage.edit({ content: `${msg.author} has joined!`, embeds: [rafflesOBJ[msg.guildId].ongoingRaffles[raffleIdx].embed] });
    } catch (error) {
        // handle error if needed
    }
}