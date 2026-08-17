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

    const amountArg = args.find(arg => !arg.startsWith("<@") && !isNaN(parseInt(arg, 10)));
    const amount = parseInt(amountArg, 10);
    if (isNaN(amount) || amount <= 0 || !Number.isInteger(amount)) {
        msg.channel.send(await ougi.text({ msg, stringID: "pay_invalidAmount" }));
        return;
    }

    const db = ougi.db();
    const guildId = msg.guildId;
    const guildEco = db.getGuildEconomy(guildId);

    const result = db.transferMoney(guildId, msg.author.id, targetUser.id, amount);
    if (!result.success) {
        if (result.reason === 'insufficient_funds') {
            msg.channel.send(await ougi.text({ msg, stringID: "economy_insufficientFunds" }));
        } else {
            msg.channel.send(await ougi.text({ msg, stringID: "pay_invalidAmount" }));
        }
        return;
    }

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
        .setFooter({ text: await ougi.text({ msg, stringID: "economy_footer" }), iconURL: msg.client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
        .setTimestamp();

    msg.channel.send({ embeds: [embed] });
};
