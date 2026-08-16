const { EmbedBuilder } = require('discord.js');

module.exports = async function payCommand(args, msg) {
    if (!msg.guild) {
        msg.channel.send(await ougi.text({ msg, stringID: "mustGuild" })).catch(console.error);
        return;
    }

    const targetUser = msg.mentions.users.first();
    if (!targetUser || targetUser.bot || targetUser.id === msg.author.id) {
        msg.channel.send(await ougi.text({ msg, stringID: "pay_invalidMember" }));
        return;
    }

    const amount = parseInt(args.find(arg => !arg.startsWith("<@")), 10);
    if (isNaN(amount) || amount <= 0) {
        msg.channel.send(await ougi.text({ msg, stringID: "pay_invalidAmount" }));
        return;
    }

    const db = ougi.db();
    const guildId = msg.guildId;
    const guildEco = db.getGuildEconomy(guildId);
    const sender = db.getUser(guildId, msg.author.id);

    if ((sender.money || 0) < amount) {
        msg.channel.send(await ougi.text({ msg, stringID: "economy_insufficientFunds" }));
        return;
    }

    const receiver = db.getUser(guildId, targetUser.id);
    sender.money -= amount;
    receiver.money += amount;
    db.saveUser(guildId, msg.author.id, sender);
    db.saveUser(guildId, targetUser.id, receiver);

    const renderedDesc = await ougi.text({
        msg,
        stringID: "pay_transferDesc",
        values: {
            sender: msg.author.username,
            amount: amount,
            currency: guildEco.currency,
            receiver: targetUser.username
        }
    });

    const embed = new EmbedBuilder()
        .setTitle(await ougi.text({ msg, stringID: "pay_transferTitle" }))
        .setDescription(renderedDesc)
        .setColor("#00FF88")
        .setFooter({ text: await ougi.text({ msg, stringID: "economy_footer" }), iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) })
        .setTimestamp();

    msg.channel.send({ embeds: [embed] });
};

