const { EmbedBuilder } = require('discord.js');
const crypto = require('crypto');

module.exports = async function gamblingCommands(args, msg, subCommand) {
    if (!msg.guild) {
        msg.channel.send(await ougi.text({ msg, stringID: "mustGuild" })).catch(console.error);
        return;
    }

    const db = ougi.db();
    const guildId = msg.guildId;
    const userId = msg.author.id;
    const guildEco = db.getGuildEconomy(guildId);
    const currencySymbol = guildEco.currency;

    const bet = parseInt(args[0], 10);
    if (isNaN(bet) || bet <= 0 || !Number.isInteger(bet)) {
        msg.channel.send(await ougi.text({ msg, stringID: "gamble_invalidBet" }));
        return;
    }

    // Atomically debit the bet first
    const debit = db.adjustMoney(guildId, userId, -bet);
    if (!debit.success) {
        msg.channel.send(await ougi.text({
            msg,
            stringID: "gamble_notEnoughCurrency",
            values: {
                bet,
                currency: currencySymbol
            }
        }));
        return;
    }

    let finalBalance = debit.balance;

    if (subCommand === 'coinflip') {
        const choice = (args[1] || 'heads').toLowerCase();
        if (choice !== 'heads' && choice !== 'tails') {
            // Refund bet if invalid choice
            db.adjustMoney(guildId, userId, bet);
            msg.channel.send(await ougi.text({ msg, stringID: "coinflip_invalidChoice", values: { heads: "`heads`", tails: "`tails`", example: "`ougi coinflip 50 heads`" } }));
            return;
        }
        const outcome = crypto.randomInt(0, 2) === 0 ? 'heads' : 'tails';
        const won = choice === outcome;
        if (won) {
            const credit = db.adjustMoney(guildId, userId, bet * 2);
            finalBalance = credit.balance;
        }

        const resultString = won
            ? await ougi.text({ msg, stringID: "coinflip_won", values: { bet, currency: currencySymbol } })
            : await ougi.text({ msg, stringID: "coinflip_lost", values: { bet, currency: currencySymbol } });

        const renderedDesc = await ougi.text({
            msg,
            stringID: "coinflip_desc",
            values: {
                outcome: outcome.toUpperCase(),
                result: resultString,
                balance: finalBalance,
                currency: currencySymbol
            }
        });

        const embed = new EmbedBuilder()
            .setTitle(await ougi.text({ msg, stringID: "coinflip_title" }))
            .setDescription(renderedDesc)
            .setColor(won ? "#00FF00" : "#FF0000");

        msg.channel.send({ embeds: [embed] });
        return;
    }

    if (subCommand === 'slots') {
        const symbols = ['🍒', '🍋', '🍇', '🍉', '⭐', '7️⃣'];
        const reel1 = symbols[crypto.randomInt(0, symbols.length)];
        const reel2 = symbols[crypto.randomInt(0, symbols.length)];
        const reel3 = symbols[crypto.randomInt(0, symbols.length)];

        let winnings = 0;
        if (reel1 === reel2 && reel2 === reel3) {
            winnings = bet * 5;
        } else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
            winnings = bet * 2;
        }

        if (winnings > 0) {
            const credit = db.adjustMoney(guildId, userId, winnings);
            finalBalance = credit.balance;
        }

        const resultString = winnings > 0
            ? await ougi.text({ msg, stringID: "slots_jackpot", values: { winnings, currency: currencySymbol } })
            : await ougi.text({ msg, stringID: "slots_noMatch", values: { bet, currency: currencySymbol } });

        const renderedDesc = await ougi.text({
            msg,
            stringID: "slots_desc",
            values: {
                reel1,
                reel2,
                reel3,
                result: resultString,
                balance: finalBalance,
                currency: currencySymbol
            }
        });

        const embed = new EmbedBuilder()
            .setTitle(await ougi.text({ msg, stringID: "slots_title" }))
            .setDescription(renderedDesc)
            .setColor(winnings > 0 ? "#FFD700" : "#FF0000");

        msg.channel.send({ embeds: [embed] });
        return;
    }

    if (subCommand === 'gamble') {
        const userRoll = crypto.randomInt(1, 101);
        const won = userRoll > 55;
        if (won) {
            const credit = db.adjustMoney(guildId, userId, bet * 2);
            finalBalance = credit.balance;
        }

        const resultString = won
            ? await ougi.text({ msg, stringID: "coinflip_won", values: { bet, currency: currencySymbol } })
            : await ougi.text({ msg, stringID: "coinflip_lost", values: { bet, currency: currencySymbol } });

        const renderedDesc = await ougi.text({
            msg,
            stringID: "gamble_highRollDesc",
            values: {
                roll: userRoll,
                result: resultString,
                balance: finalBalance,
                currency: currencySymbol
            }
        });

        const embed = new EmbedBuilder()
            .setTitle(await ougi.text({ msg, stringID: "gamble_highRollTitle" }))
            .setDescription(renderedDesc)
            .setColor(won ? "#00FF00" : "#FF0000");

        msg.channel.send({ embeds: [embed] });
    }
};
