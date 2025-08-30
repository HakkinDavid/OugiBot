module.exports = async function (msg, silent = false) {
    if (msg.guild.ownerId == msg.author.id || (Array.isArray(settingsOBJ.guildAdmins[msg.guildId]) && settingsOBJ.guildAdmins[msg.guildId].includes(msg.author.id))) {
      return true;
    }
    if (!silent) msg.channel.send(await ougi.text(msg, "mustOwnOrAdmin"));
    return false;
}