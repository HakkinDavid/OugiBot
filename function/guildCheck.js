module.exports = async function (msg) {
    if (msg.channel.type !== Discord.ChannelType.GuildText) {
        msg.channel.send(await ougi.text(msg, "mustGuild"));
        return false;
    }
    return true;
}