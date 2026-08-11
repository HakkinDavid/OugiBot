const { EmbedBuilder } = require('discord.js');

module.exports = async function leaderboardCommand(args, msg) {
    if (!msg.guild) {
        msg.channel.send(await ougi.text(msg, "mustGuild")).catch(console.error);
        return;
    }

    ougi.economy('init', msg);

    const guildId = msg.guildId;
    const usersData = settingsOBJ.economy[guildId].users || {};
    const currencySymbol = settingsOBJ.economy[guildId].currency || "$";

    const sortedUsers = Object.entries(usersData)
        .map(([id, data]) => ({ id, money: data.money || 0, xp: data.xp || 0, level: data.level || 0 }))
        .sort((a, b) => b.money - a.money)
        .slice(0, 10);

    if (sortedUsers.length === 0) {
        msg.channel.send("No economy records found for this server yet.");
        return;
    }

    const leaderboardLines = [];
    for (let i = 0; i < sortedUsers.length; i++) {
        const entry = sortedUsers[i];
        let userTag = `<@${entry.id}>`;
        try {
            const fetched = await msg.client.users.fetch(entry.id);
            userTag = fetched.username;
        } catch { }

        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `**#${i + 1}**`;
        leaderboardLines.push(`${medal} **${userTag}** — ${entry.money} ${currencySymbol} *(Lvl ${entry.level})*`);
    }

    const embed = new EmbedBuilder()
        .setTitle(`🏆 ${msg.guild.name} Economy Leaderboard`)
        .setDescription(leaderboardLines.join("\n"))
        .setColor("#FF8C00")
        .setFooter({ text: "Ougi Economy System", iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) })
        .setTimestamp();

    msg.channel.send({ embeds: [embed] });
};
