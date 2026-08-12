module.exports = async function (msg) {
    const args = msg.content.split(/\s+/).slice(2);
    const guildId = args[0] || msg.guildId;
    const durationHours = parseInt(args[1], 10) || 720; // Default 30 days
    const concurrent = parseInt(args[2], 10) || 5;
    const participants = parseInt(args[3], 10) || 100;

    if (!guildId) {
        msg.channel.send("Usage: `#ougi raffle-license <guild_id> [duration_hours] [concurrent_limit] [participant_limit]`");
        return;
    }

    const { data: guildRaffles } = ougi.db().getOrCreateGuildRaffles(guildId);
    guildRaffles.licensedUntil = Date.now() + (durationHours * 3600 * 1000);
    guildRaffles.allowedConcurrentRaffles = concurrent;
    guildRaffles.allowedParticipants = participants;

    ougi.db().saveRaffles();

    msg.channel.send(`✅ Updated raffle license for guild \`${guildId}\`:\n• **Licensed Until:** ${new Date(guildRaffles.licensedUntil).toISOString()}\n• **Concurrent Limit:** ${concurrent}\n• **Participant Limit:** ${participants}`);
};
