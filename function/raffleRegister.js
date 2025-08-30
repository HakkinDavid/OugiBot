module.exports = async function (arguments, msg) {
    if (!ougi.guildCheck(msg)) return;

    const participantName = arguments.join(" ");
    if (!participantName.trim()) {
        msg.channel.send("Error: Please provide a name to register.");
        return;
    }
    if (!settingsOBJ.nicknames) return;
    if (!settingsOBJ.nicknames[msg.guildId]) {
        settingsOBJ.nicknames[msg.guildId] = {};
    }
    settingsOBJ.nicknames[msg.guildId][msg.author.id] = participantName;
    msg.channel.send(`You have been registered as: ${participantName}`);
    await ougi.backup(database.settings.file, channels.settings);
    return;
}