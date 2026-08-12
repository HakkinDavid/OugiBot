module.exports =

async function (msg) {
    if (!(await ougi.guildCheck(msg))) return;

    const db = ougi.db();
    const guildEco = db.getGuildEconomy(msg.guildId);

    if (guildEco.disabled) {
        msg.channel.send("Economy is not enabled in this Discord server.");
        return;
    }

    const user = db.getUser(msg.guildId, msg.author.id);
    const rn = Date.now();

    if (user.worked && (rn - user.worked) <= guildEco.cooldown * 1000) {
        const remaining = ((guildEco.cooldown * 1000) - (rn - user.worked)) / 1000;
        msg.channel.send("You're working too often, get some rest. `Cooldown: " + remaining + " seconds`");
        return;
    }

    user.worked = rn;
    db.saveUser(msg.guildId, msg.author.id, user);

    let embed = new Discord.EmbedBuilder()
        .setTitle(msg.author.username + " is working...")
        .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/loading.gif?raw=true")
        .setColor("#00D0D0");

    msg.channel.send({ embeds: [embed] }).then(message => {
        setTimeout(function () {
            message.delete();
            let workEmbed = new Discord.EmbedBuilder()
                .setTitle("Here's your well deserved money " + msg.author.username + "!")
                .setThumbnail(msg.author.avatarURL({ dynamic: true, size: 4096 }))
                .setDescription("You've earned " + guildEco.currency + ougi.economy('add', msg, { reason: 'work' }))
                .setColor("#281E87");
            message.channel.send({ embeds: [workEmbed] });
        }, Math.floor(Math.random() * 10000));
    });
}