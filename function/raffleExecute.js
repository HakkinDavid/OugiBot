module.exports = async function (raffleGuildId, raffleIdx) {
    const guildData = rafflesOBJ[raffleGuildId];
    if (!guildData) return;

    const raffle = guildData.ongoingRaffles?.[raffleIdx];
    if (!raffle) return;

    try {
        const channel = await client.channels.fetch(raffle.config.channelId);
        const msg = await channel.messages.fetch(raffle.messageId);

        raffle.winners = await ougi.pickWinners(raffle.participants, raffle.config.winnersCount);
        raffle.finished = true;

        await msg.edit({ content: "The results are in!", embeds: [raffle.embed] });
        await msg.reply(
            `**Winners**\n${raffle.winners.map(w => `${w.name} (${Discord.userMention(w.id)})`).join("\n")}`
        );

        await ougi.writeFile(database.raffles.file, JSON.stringify(rafflesOBJ, null, 4), console.error);
        await ougi.backup(database.raffles.file, channels.raffles);
    } catch (err) {
        ougi.globalLog(`Raffle execution failed for guild ${raffleGuildId}: ${err}`);
    }
};