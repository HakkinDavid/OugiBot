const { EmbedBuilder } = require('discord.js');

module.exports = async function gamblingCommands(args, msg, subCommand) {
    if (!msg.guild) {
        msg.channel.send(await ougi.text({ msg, stringID: "mustGuild" })).catch(console.error);
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
        msg.channel.send(await ougi.text({ msg, stringID: "gamble_invalidBet" }));
        return;
    }

    if ((user.money || 0) < bet) {
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

    if (subCommand === 'coinflip') {
        const choice = (args[1] || 'heads').toLowerCase();
        if (choice !== 'heads' && choice !== 'tails') {
            msg.channel.send(await ougi.text({ msg, stringID: "coinflip_invalidChoice" }));
            return;
        }
        const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
        const won = choice === outcome;
        if (won) { user.money += bet; } else { user.money -= bet; }
        db.saveUser(guildId, userId, user);

        const resultString = won
            ? await ougi.text({ msg, stringID: "coinflip_won", values: { bet, currency: currencySymbol } })
            : await ougi.text({ msg, stringID: "coinflip_lost", values: { bet, currency: currencySymbol } });

        const renderedDesc = await ougi.text({
            msg,
            stringID: "coinflip_desc",
            values: {
                outcome: outcome.toUpperCase(),
                result: resultString,
                balance: user.money,
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
                balance: user.money,
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
        const userRoll = Math.floor(Math.random() * 100) + 1;
        const won = userRoll > 55;
        if (won) { user.money += bet; } else { user.money -= bet; }
        db.saveUser(guildId, userId, user);

        const resultString = won
            ? await ougi.text({ msg, stringID: "coinflip_won", values: { bet, currency: currencySymbol } })
            : await ougi.text({ msg, stringID: "coinflip_lost", values: { bet, currency: currencySymbol } });

        const renderedDesc = await ougi.text({
            msg,
            stringID: "gamble_highRollDesc",
            values: {
                roll: userRoll,
                result: resultString,
                balance: user.money,
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
