module.exports = async function (arguments, msg) {
    if (!(await ougi.guildCheck(msg))) return;

    const participantName = msg.content.slice(msg.content.toLowerCase().indexOf("raffle-register") + "raffle-register".length).trim();
    if (!participantName.trim()) {
        msg.channel.send(await ougi.text(msg, "raffle_registerProvideName"));
        return;
    }
    const nicknames = ougi.db().getNicknames(msg.guildId);
    const existingNicknames = Object.values(nicknames);
    if (existingNicknames.some(name => name.toLowerCase() === participantName.toLowerCase())) {
        msg.channel.send(await ougi.text(msg, "raffle_registerNameTaken"));
        return;
    }
    ougi.db().setNickname(msg.guildId, msg.author.id, participantName);
    const registerSuccessTemplate = await ougi.text(msg, "raffle_registerSuccess");
    msg.channel.send(registerSuccessTemplate.replace(/{name}/g, participantName));
    return;
}