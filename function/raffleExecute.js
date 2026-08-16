module.exports = async function (raffleGuildId, raffleIdx) {
    const guildData = ougi.db().getGuildRaffles(raffleGuildId);
    if (!guildData) return;

    const raffle = guildData.ongoingRaffles?.[raffleIdx];
    if (!raffle) return;

    try {
        const channel = await client.channels.fetch(raffle.config.channelId);
        const msg = await channel.messages.fetch(raffle.messageId);

        raffle.winners = await ougi.pickWinners(raffle.participants, raffle.config.winnersCount);
        raffle.finished = true;

        const resultsInText = await ougi.text(raffleGuildId, "raffle_resultsIn");
        const winnersHeader = await ougi.text(raffleGuildId, "raffle_winnersHeader");

        await msg.edit({ content: resultsInText, embeds: [raffle.embed] });
        await msg.reply(
            `${winnersHeader}\n${raffle.winners.map(w => `${w.name} (${Discord.userMention(w.id)})`).join("\n")}`
        );

        ougi.db().saveRaffles();
    } catch (err) {
        ougi.globalLog(`Raffle execution failed for guild ${raffleGuildId}: ${err}`);
    }
};