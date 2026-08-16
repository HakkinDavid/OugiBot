const { EmbedBuilder } = require('discord.js');

module.exports = async function leaderboardCommand(args, msg) {
    if (!msg.guild) {
        msg.channel.send(await ougi.text({ msg, stringID: "mustGuild" })).catch(console.error);
        return;
    }

    const db = ougi.db();
    const guildId = msg.guildId;
    const guildEco = db.getGuildEconomy(guildId);
    const topUsers = db.getLeaderboard(guildId, 10);

    if (topUsers.length === 0) {
        msg.channel.send(await ougi.text({ msg, stringID: "leaderboard_noRecords" }));
        return;
    }

    const leaderboardLines = [];
    for (let i = 0; i < topUsers.length; i++) {
        const entry = topUsers[i];
        let userTag = `<@${entry.user_id}>`;
        try {
            const fetched = await msg.client.users.fetch(entry.user_id);
            userTag = fetched.username;
        } catch { }

        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
        const line = await ougi.text({
            msg,
            stringID: "leaderboard_line",
            values: {
                medal,
                userTag,
                money: entry.money,
                currency: guildEco.currency,
                level: entry.level
            }
        });
        leaderboardLines.push(line);
    }

    const embed = new EmbedBuilder()
        .setTitle(await ougi.text({ msg, stringID: "leaderboard_title", values: { guildName: msg.guild.name } }))
        .setDescription(leaderboardLines.join("\n"))
        .setColor("#FF8C00")
        .setFooter({ text: await ougi.text({ msg, stringID: "economy_footer" }), iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) })
        .setTimestamp();

    msg.channel.send({ embeds: [embed] });
};

