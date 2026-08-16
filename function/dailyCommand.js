const { EmbedBuilder } = require('discord.js');

module.exports = async function dailyCommand(args, msg) {
    if (!msg.guild) {
        msg.channel.send(await ougi.text({ msg, stringID: "mustGuild" })).catch(console.error);
        return;
    }

    const db = ougi.db();
    const guildId = msg.guildId;
    const userId = msg.author.id;
    const guildEco = db.getGuildEconomy(guildId);
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000; // 24 hours

    const user = db.getUser(guildId, userId);
    if (user.last_daily && (now - user.last_daily < cooldown)) {
        const remainingMs = cooldown - (now - user.last_daily);
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        msg.channel.send(await ougi.text({
            msg,
            stringID: "daily_cooldown",
            values: {
                hours,
                minutes
            }
        }));
        return;
    }

    const dailyReward = Math.floor(250 * guildEco.multiplier);
    user.money = (user.money || 0) + dailyReward;
    user.last_daily = now;
    db.saveUser(guildId, userId, user);

    const renderedDesc = await ougi.text({
        msg,
        stringID: "daily_claimedDesc",
        values: {
            reward: dailyReward,
            currency: guildEco.currency,
            balance: user.money
        }
    });

    const embed = new EmbedBuilder()
        .setTitle(await ougi.text({ msg, stringID: "daily_claimedTitle" }))
        .setDescription(renderedDesc)
        .setColor("#FFD700")
        .setFooter({ text: await ougi.text({ msg, stringID: "economy_footer" }), iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) })
        .setTimestamp();

    msg.channel.send({ embeds: [embed] });
};
