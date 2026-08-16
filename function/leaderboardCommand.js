const { EmbedBuilder } = require('discord.js');

module.exports = async function leaderboardCommand(args, msg) {
    if (!msg.guild) {
        msg.channel.send(await ougi.text(msg, "mustGuild")).catch(console.error);
        return;
    }

    const db = ougi.db();
    const guildId = msg.guildId;
    const guildEco = db.getGuildEconomy(guildId);
    const topUsers = db.getLeaderboard(guildId, 10);

    if (topUsers.length === 0) {
        msg.channel.send(await ougi.text(msg, "leaderboard_noRecords"));
        return;
    }

    const leaderboardLineTemplate = await ougi.text(msg, "leaderboard_line");
    const leaderboardLines = [];
    for (let i = 0; i < topUsers.length; i++) {
        const entry = topUsers[i];
        let userTag = `<@${entry.user_id}>`;
        try {
            const fetched = await msg.client.users.fetch(entry.user_id);
            userTag = fetched.username;
        } catch { }

        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `**#${i + 1}**`;
        leaderboardLines.push(
            leaderboardLineTemplate
                .replace(/{medal}/g, medal)
                .replace(/{userTag}/g, userTag)
                .replace(/{money}/g, entry.money)
                .replace(/{currency}/g, guildEco.currency)
                .replace(/{level}/g, entry.level)
        );
    }

    const titleTemplate = await ougi.text(msg, "leaderboard_title");
    const embed = new EmbedBuilder()
        .setTitle(titleTemplate.replace(/{guildName}/g, msg.guild.name))
        .setDescription(leaderboardLines.join("\n"))
        .setColor("#FF8C00")
        .setFooter({ text: await ougi.text(msg, "economy_footer"), iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) })
        .setTimestamp();

    msg.channel.send({ embeds: [embed] });
};

