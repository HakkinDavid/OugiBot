const { EmbedBuilder } = require('discord.js');

module.exports = async function payCommand(args, msg) {
    if (!msg.guild) {
        msg.channel.send(await ougi.text(msg, "mustGuild")).catch(console.error);
        return;
    }

    const targetUser = msg.mentions.users.first();
    if (!targetUser || targetUser.bot || targetUser.id === msg.author.id) {
        msg.channel.send("Please mention a valid server member to send money to.");
        return;
    }

    const amount = parseInt(args.find(arg => !arg.startsWith("<@")), 10);
    if (isNaN(amount) || amount <= 0) {
        msg.channel.send("Please specify a valid positive amount of currency to transfer.");
        return;
    }

    const db = ougi.db();
    const guildId = msg.guildId;
    const guildEco = db.getGuildEconomy(guildId);
    const sender = db.getUser(guildId, msg.author.id);

    if ((sender.money || 0) < amount) {
        msg.channel.send("You do not have enough funds to complete this transfer.");
        return;
    }

    const receiver = db.getUser(guildId, targetUser.id);
    sender.money -= amount;
    receiver.money += amount;
    db.saveUser(guildId, msg.author.id, sender);
    db.saveUser(guildId, targetUser.id, receiver);

    const embed = new EmbedBuilder()
        .setTitle("💸 Currency Transfer")
        .setDescription(`**${msg.author.username}** transferred **${amount} ${guildEco.currency}** to **${targetUser.username}**!`)
        .setColor("#00FF88")
        .setFooter({ text: "Ougi Economy System", iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) })
        .setTimestamp();

    msg.channel.send({ embeds: [embed] });
};

