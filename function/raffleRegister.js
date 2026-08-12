module.exports = async function (arguments, msg) {
    if (!(await ougi.guildCheck(msg))) return;

    const participantName = msg.content.slice(msg.content.toLowerCase().indexOf("raffle-register") + "raffle-register".length).trim();
    if (!participantName.trim()) {
        msg.channel.send("Error: Please provide a name to register.");
        return;
    }
    const nicknames = ougi.db().getNicknames(msg.guildId);
    const existingNicknames = Object.values(nicknames);
    if (existingNicknames.some(name => name.toLowerCase() === participantName.toLowerCase())) {
        msg.channel.send("Error: This name has already been registered by another user.");
        return;
    }
    ougi.db().setNickname(msg.guildId, msg.author.id, participantName);
    msg.channel.send(`You have been registered as: ${participantName}`);
    return;
}