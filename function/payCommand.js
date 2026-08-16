const { EmbedBuilder } = require('discord.js');

module.exports = async function payCommand(args, msg) {
    if (!msg.guild) {
        msg.channel.send(await ougi.text(msg, "mustGuild")).catch(console.error);
        return;
    }

    const targetUser = msg.mentions.users.first();
    if (!targetUser || targetUser.bot || targetUser.id === msg.author.id) {
        msg.channel.send(await ougi.text(msg, "pay_invalidMember"));
        return;
    }

    const amount = parseInt(args.find(arg => !arg.startsWith("<@")), 10);
    if (isNaN(amount) || amount <= 0) {
        msg.channel.send(await ougi.text(msg, "pay_invalidAmount"));
        return;
    }

    const db = ougi.db();
    const guildId = msg.guildId;
    const guildEco = db.getGuildEconomy(guildId);
    const sender = db.getUser(guildId, msg.author.id);

    if ((sender.money || 0) < amount) {
        msg.channel.send(await ougi.text(msg, "economy_insufficientFunds"));
        return;
    }

    const receiver = db.getUser(guildId, targetUser.id);
    sender.money -= amount;
    receiver.money += amount;
    db.saveUser(guildId, msg.author.id, sender);
    db.saveUser(guildId, targetUser.id, receiver);

    const descTemplate = await ougi.text(msg, "pay_transferDesc");
    const renderedDesc = descTemplate
        .replace(/{sender}/g, msg.author.username)
        .replace(/{amount}/g, amount)
        .replace(/{currency}/g, guildEco.currency)
        .replace(/{receiver}/g, targetUser.username);

    const embed = new EmbedBuilder()
        .setTitle(await ougi.text(msg, "pay_transferTitle"))
        .setDescription(renderedDesc)
        .setColor("#00FF88")
        .setFooter({ text: await ougi.text(msg, "economy_footer"), iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) })
        .setTimestamp();

    msg.channel.send({ embeds: [embed] });
};

