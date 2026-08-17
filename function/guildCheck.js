module.exports = async function (msg) {
    if (!msg || !msg.guild || !msg.guildId) {
        if (msg?.channel?.send) {
            msg.channel.send(await ougi.text({ msg, stringID: "mustGuild" }).catch(() => "This command must be executed within a server.")).catch(() => {});
        }
        return false;
    }
    return true;
};