module.exports =

async function (msg) {
    if (!(await ougi.guildCheck(msg))) return;

    const db = ougi.db();
    const guildEco = db.getGuildEconomy(msg.guildId);

    if (guildEco.disabled) {
        msg.channel.send(await ougi.text(msg, "economy_disabled"));
        return;
    }

    const user = db.getUser(msg.guildId, msg.author.id);
    const rn = Date.now();

    if (user.worked && (rn - user.worked) <= guildEco.cooldown * 1000) {
        const remaining = ((guildEco.cooldown * 1000) - (rn - user.worked)) / 1000;
        const cooldownTemplate = await ougi.text(msg, "work_cooldown");
        msg.channel.send(cooldownTemplate.replace(/{remaining}/g, remaining));
        return;
    }

    user.worked = rn;
    db.saveUser(msg.guildId, msg.author.id, user);

    const workingTitleTemplate = await ougi.text(msg, "work_workingTitle");
    let embed = new Discord.EmbedBuilder()
        .setTitle(workingTitleTemplate.replace(/{username}/g, msg.author.username))
        .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/loading.gif?raw=true")
        .setColor("#00D0D0");

    msg.channel.send({ embeds: [embed] }).then(async message => {
        const rewardTitleTemplate = await ougi.text(msg, "work_rewardTitle");
        const rewardDescTemplate = await ougi.text(msg, "work_rewardDesc");
        const earned = ougi.economy('add', msg, { reason: 'work' });
        setTimeout(function () {
            message.delete();
            let workEmbed = new Discord.EmbedBuilder()
                .setTitle(rewardTitleTemplate.replace(/{username}/g, msg.author.username))
                .setThumbnail(msg.author.avatarURL({ dynamic: true, size: 4096 }))
                .setDescription(rewardDescTemplate.replace(/{currency}/g, guildEco.currency).replace(/{amount}/g, earned))
                .setColor("#281E87");
            message.channel.send({ embeds: [workEmbed] });
        }, Math.floor(Math.random() * 10000));
    });
}