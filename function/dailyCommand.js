const { EmbedBuilder } = require('discord.js');

module.exports = async function dailyCommand(args, msg) {
    if (!msg.guild) {
        msg.channel.send(await ougi.text(msg, "mustGuild")).catch(console.error);
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
        const cooldownTemplate = await ougi.text(msg, "daily_cooldown");
        msg.channel.send(cooldownTemplate.replace(/{hours}/g, hours).replace(/{minutes}/g, minutes));
        return;
    }

    const dailyReward = Math.floor(250 * guildEco.multiplier);
    user.money = (user.money || 0) + dailyReward;
    user.last_daily = now;
    db.saveUser(guildId, userId, user);

    const descTemplate = await ougi.text(msg, "daily_claimedDesc");
    const renderedDesc = descTemplate
        .replace(/{reward}/g, dailyReward)
        .replace(/{currency}/g, guildEco.currency)
        .replace(/{balance}/g, user.money);

    const embed = new EmbedBuilder()
        .setTitle(await ougi.text(msg, "daily_claimedTitle"))
        .setDescription(renderedDesc)
        .setColor("#FFD700")
        .setFooter({ text: await ougi.text(msg, "economy_footer"), iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) })
        .setTimestamp();

    msg.channel.send({ embeds: [embed] });
};

