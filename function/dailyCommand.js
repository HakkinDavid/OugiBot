const { EmbedBuilder } = require('discord.js');

module.exports = async function dailyCommand(args, msg) {
    if (!msg.guild) {
        msg.channel.send(await ougi.text(msg, "mustGuild")).catch(console.error);
        return;
    }

    ougi.economy('init', msg);

    const guildId = msg.guildId;
    const userId = msg.author.id;
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000; // 24 hours

    const userEco = settingsOBJ.economy[guildId].users[userId];
    if (userEco.lastDaily && (now - userEco.lastDaily < cooldown)) {
        const remainingMs = cooldown - (now - userEco.lastDaily);
        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
        msg.channel.send(`You have already claimed your daily bonus! Come back in **${hours}h ${minutes}m**.`);
        return;
    }

    const multiplier = settingsOBJ.economy[guildId].multiplier || 1;
    const dailyReward = Math.floor(250 * multiplier);

    userEco.money = (userEco.money || 0) + dailyReward;
    userEco.lastDaily = now;

    await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
    await ougi.backup(database.settings.file, channels.settings);

    const currencySymbol = settingsOBJ.economy[guildId].currency || "$";

    const embed = new EmbedBuilder()
        .setTitle("☀️ Daily Bonus Claimed!")
        .setDescription(`You received **${dailyReward} ${currencySymbol}** for logging in today!\nYour new balance: **${userEco.money} ${currencySymbol}**`)
        .setColor("#FFD700")
        .setFooter({ text: "Ougi Economy System", iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) })
        .setTimestamp();

    msg.channel.send({ embeds: [embed] });
};
