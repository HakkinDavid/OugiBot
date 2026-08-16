module.exports = async function (msg) {
    const args = msg.content.split(/\s+/).slice(2);
    const guildId = args[0];
    const durationHours = parseInt(args[1], 10) || 720; // Default 30 days
    const concurrent = parseInt(args[2], 10) || 1;
    const participants = parseInt(args[3], 10) || 50;

    if (!guildId) {
        msg.channel.send(await ougi.text(msg, "raffle_licenseUsage"));
        return;
    }

    const { data: guildRaffles } = ougi.db().getOrCreateGuildRaffles(guildId);
    guildRaffles.licensedUntil = Date.now() + (durationHours * 3600 * 1000);
    guildRaffles.allowedConcurrentRaffles = concurrent;
    guildRaffles.allowedParticipants = participants;

    ougi.db().saveRaffles();

    const licenseUpdatedTemplate = await ougi.text(msg, "raffle_licenseUpdated");
    msg.channel.send(
        licenseUpdatedTemplate
            .replace(/{guildId}/g, guildId)
            .replace(/{until}/g, new Date(guildRaffles.licensedUntil).toISOString())
            .replace(/{concurrent}/g, concurrent)
            .replace(/{participants}/g, participants)
    );
};
