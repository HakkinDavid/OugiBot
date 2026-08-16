const { EmbedBuilder } = require('discord.js');

module.exports = async function gamblingCommands(args, msg, subCommand) {
    if (!msg.guild) {
        msg.channel.send(await ougi.text(msg, "mustGuild")).catch(console.error);
        return;
    }

    const db = ougi.db();
    const guildId = msg.guildId;
    const userId = msg.author.id;
    const guildEco = db.getGuildEconomy(guildId);
    const user = db.getUser(guildId, userId);
    const currencySymbol = guildEco.currency;

    const bet = parseInt(args[0], 10);
    if (isNaN(bet) || bet <= 0) {
        msg.channel.send(await ougi.text(msg, "gamble_invalidBet"));
        return;
    }

    if ((user.money || 0) < bet) {
        const notEnoughTemplate = await ougi.text(msg, "gamble_notEnoughCurrency");
        msg.channel.send(notEnoughTemplate.replace(/{bet}/g, bet).replace(/{currency}/g, currencySymbol));
        return;
    }

    if (subCommand === 'coinflip') {
        const choice = (args[1] || 'heads').toLowerCase();
        if (choice !== 'heads' && choice !== 'tails') {
            msg.channel.send(await ougi.text(msg, "coinflip_invalidChoice"));
            return;
        }
        const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
        const won = choice === outcome;
        if (won) { user.money += bet; } else { user.money -= bet; }
        db.saveUser(guildId, userId, user);

        const wonTemplate = await ougi.text(msg, "coinflip_won");
        const lostTemplate = await ougi.text(msg, "coinflip_lost");
        const resultString = won
            ? wonTemplate.replace(/{bet}/g, bet).replace(/{currency}/g, currencySymbol)
            : lostTemplate.replace(/{bet}/g, bet).replace(/{currency}/g, currencySymbol);

        const descTemplate = await ougi.text(msg, "coinflip_desc");
        const renderedDesc = descTemplate
            .replace(/{outcome}/g, outcome.toUpperCase())
            .replace(/{result}/g, resultString)
            .replace(/{balance}/g, user.money)
            .replace(/{currency}/g, currencySymbol);

        const embed = new EmbedBuilder()
            .setTitle(await ougi.text(msg, "coinflip_title"))
            .setDescription(renderedDesc)
            .setColor(won ? "#00FF00" : "#FF0000");

        msg.channel.send({ embeds: [embed] });
        return;
    }

    if (subCommand === 'slots') {
        const symbols = ['🍒', '🍋', '🍇', '🍉', '⭐', '7️⃣'];
        const reel1 = symbols[Math.floor(Math.random() * symbols.length)];
        const reel2 = symbols[Math.floor(Math.random() * symbols.length)];
        const reel3 = symbols[Math.floor(Math.random() * symbols.length)];

        let winnings = 0;
        if (reel1 === reel2 && reel2 === reel3) {
            winnings = bet * 5;
        } else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
            winnings = bet * 2;
        }

        if (winnings > 0) { user.money += (winnings - bet); } else { user.money -= bet; }
        db.saveUser(guildId, userId, user);

        const jackpotTemplate = await ougi.text(msg, "slots_jackpot");
        const noMatchTemplate = await ougi.text(msg, "slots_noMatch");
        const resultString = winnings > 0
            ? jackpotTemplate.replace(/{winnings}/g, winnings).replace(/{currency}/g, currencySymbol)
            : noMatchTemplate.replace(/{bet}/g, bet).replace(/{currency}/g, currencySymbol);

        const descTemplate = await ougi.text(msg, "slots_desc");
        const renderedDesc = descTemplate
            .replace(/{reel1}/g, reel1)
            .replace(/{reel2}/g, reel2)
            .replace(/{reel3}/g, reel3)
            .replace(/{result}/g, resultString)
            .replace(/{balance}/g, user.money)
            .replace(/{currency}/g, currencySymbol);

        const embed = new EmbedBuilder()
            .setTitle(await ougi.text(msg, "slots_title"))
            .setDescription(renderedDesc)
            .setColor(winnings > 0 ? "#FFD700" : "#FF0000");

        msg.channel.send({ embeds: [embed] });
        return;
    }

    if (subCommand === 'gamble') {
        const userRoll = Math.floor(Math.random() * 100) + 1;
        const won = userRoll > 55;
        if (won) { user.money += bet; } else { user.money -= bet; }
        db.saveUser(guildId, userId, user);

        const wonTemplate = await ougi.text(msg, "coinflip_won");
        const lostTemplate = await ougi.text(msg, "coinflip_lost");
        const resultString = won
            ? wonTemplate.replace(/{bet}/g, bet).replace(/{currency}/g, currencySymbol)
            : lostTemplate.replace(/{bet}/g, bet).replace(/{currency}/g, currencySymbol);

        const descTemplate = await ougi.text(msg, "gamble_highRollDesc");
        const renderedDesc = descTemplate
            .replace(/{roll}/g, userRoll)
            .replace(/{result}/g, resultString)
            .replace(/{balance}/g, user.money)
            .replace(/{currency}/g, currencySymbol);

        const embed = new EmbedBuilder()
            .setTitle(await ougi.text(msg, "gamble_highRollTitle"))
            .setDescription(renderedDesc)
            .setColor(won ? "#00FF00" : "#FF0000");

        msg.channel.send({ embeds: [embed] });
    }
};

