module.exports = async function (msg) {
    if (!(await ougi.guildCheck(msg))) return;

    const db = ougi.db();
    const guildEco = db.getGuildEconomy(msg.guildId);

    if (guildEco.disabled) {
        msg.channel.send(await ougi.text({ msg, stringID: "economy_disabled" }));
        return;
    }

    const user = db.getUser(msg.guildId, msg.author.id);
    const rn = Date.now();

    if (user.worked && (rn - user.worked) <= (guildEco.cooldown || 10) * 1000) {
        const remaining = Math.ceil(((guildEco.cooldown * 1000) - (rn - user.worked)) / 1000);
        msg.channel.send(await ougi.text({
            msg,
            stringID: "work_cooldown",
            values: {
                remaining
            }
        }));
        return;
    }

    user.worked = rn;
    db.saveUser(msg.guildId, msg.author.id, user);

    let embed = new Discord.EmbedBuilder()
        .setTitle(await ougi.text({
            msg,
            stringID: "work_workingTitle",
            values: {
                username: msg.author.username
            }
        }))
        .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/loading.gif?raw=true")
        .setColor("#00D0D0");

    msg.channel.send({ embeds: [embed] }).then(async message => {
        const earned = ougi.economy('add', msg, { reason: 'work' });
        const rewardTitle = await ougi.text({
            msg,
            stringID: "work_rewardTitle",
            values: { username: msg.author.username }
        });
        const rewardDesc = await ougi.text({
            msg,
            stringID: "work_rewardDesc",
            values: { currency: guildEco.currency, amount: earned }
        });
        setTimeout(function () {
            message.delete().catch(() => {});
            let workEmbed = new Discord.EmbedBuilder()
                .setTitle(rewardTitle)
                .setThumbnail(msg.author.displayAvatarURL({ dynamic: true, size: 4096 }))
                .setDescription(rewardDesc)
                .setColor("#281E87");
            message.channel.send({ embeds: [workEmbed] }).catch(console.error);
        }, 2000 + Math.floor(Math.random() * 3000));
    }).catch(console.error);
};