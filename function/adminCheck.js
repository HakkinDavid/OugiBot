module.exports = async function (msg) {
    if (msg.guild.ownerId != msg.author.id) {
      msg.channel.send(await ougi.text(msg, "mustOwn"));
      return false;
    }
    return true;
}