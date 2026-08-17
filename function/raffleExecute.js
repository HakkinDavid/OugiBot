module.exports = async function (raffleGuildId, raffleIdx) {
    const guildData = ougi.db().getGuildRaffles(raffleGuildId);
    if (!guildData) return;

    const raffle = guildData.ongoingRaffles?.[raffleIdx];
    if (!raffle || raffle.finished) return;

    raffle.finished = true;
    ougi.db().saveRaffles();

    try {
        const channel = client.channels.cache.get(raffle.config.channelId) ?? 
            await client.channels.fetch(raffle.config.channelId).catch(() => null);
        if (!channel) return;

        const msg = await channel.messages.fetch(raffle.messageId).catch(() => null);

        raffle.winners = await ougi.pickWinners(raffle.participants, raffle.config.winnersCount);
        ougi.db().saveRaffles();

        const resultsInText = await ougi.text({ lang: raffleGuildId, stringID: "raffle_resultsIn" }).catch(() => "Raffle results are in!");
        const winnersHeader = await ougi.text({ lang: raffleGuildId, stringID: "raffle_winnersHeader" }).catch(() => "🎉 Winners:");

        if (msg) {
            await msg.edit({ content: resultsInText, embeds: [raffle.embed] }).catch(() => {});
            if (raffle.winners.length > 0) {
                const winnersList = raffle.winners.map(w => w.id ? `${w.name} (<@${w.id}>)` : w.name).join("\n");
                await msg.reply(`${winnersHeader}\n${winnersList}`).catch(() => {});
            } else {
                const noWinnersText = await ougi.text({ lang: raffleGuildId, stringID: "raffle_noParticipants" }).catch(() => "No valid participants entered the raffle.");
                await msg.reply(noWinnersText).catch(() => {});
            }
        }
    } catch (err) {
        ougi.globalLog(`Raffle execution failed for guild ${raffleGuildId}: ${err}`);
    }
};