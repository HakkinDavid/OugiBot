module.exports = async function (arguments, msg) {
    if (!(await ougi.guildCheck(msg))) return;

    const participantName = msg.content.slice(msg.content.toLowerCase().indexOf("raffle-register") + "raffle-register".length).trim();
    if (!participantName.trim()) {
        msg.channel.send("Error: Please provide a name to register.");
        return;
    }
    if (!settingsOBJ.nicknames) return;
    if (!settingsOBJ.nicknames[msg.guildId]) {
        settingsOBJ.nicknames[msg.guildId] = {};
    }
    const existingNicknames = Object.values(settingsOBJ.nicknames[msg.guildId]);
    if (existingNicknames.some(name => name.toLowerCase() === participantName.toLowerCase())) {
        msg.channel.send("Error: This name has already been registered by another user.");
        return;
    }
    settingsOBJ.nicknames[msg.guildId][msg.author.id] = participantName;
    msg.channel.send(`You have been registered as: ${participantName}`);
    ougi.db().saveKV('settings', 'kv', 'settingsOBJ', settingsOBJ);
    return;
}