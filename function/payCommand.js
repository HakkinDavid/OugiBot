const { EmbedBuilder } = require('discord.js');

module.exports = async function payCommand(args, msg) {
    if (!msg.guild) {
        msg.channel.send(await ougi.text(msg, "mustGuild")).catch(console.error);
        return;
    }

    ougi.economy('init', msg);

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

    const guildId = msg.guildId;
    const senderEco = settingsOBJ.economy[guildId].users[msg.author.id];
    if (!senderEco || (senderEco.money || 0) < amount) {
        msg.channel.send("You do not have enough funds to complete this transfer.");
        return;
    }

    if (!settingsOBJ.economy[guildId].users[targetUser.id]) {
        settingsOBJ.economy[guildId].users[targetUser.id] = {
            money: 0, inventory: [], level: 0, xp: 0, badges: [], worked: 0
        };
    }

    const receiverEco = settingsOBJ.economy[guildId].users[targetUser.id];

    senderEco.money -= amount;
    receiverEco.money += amount;

    await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
    await ougi.backup(database.settings.file, channels.settings);

    const currencySymbol = settingsOBJ.economy[guildId].currency || "$";

    const embed = new EmbedBuilder()
        .setTitle("💸 Currency Transfer")
        .setDescription(`**${msg.author.username}** transferred **${amount} ${currencySymbol}** to **${targetUser.username}**!`)
        .setColor("#00FF88")
        .setFooter({ text: "Ougi Economy System", iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) })
        .setTimestamp();

    msg.channel.send({ embeds: [embed] });
};
