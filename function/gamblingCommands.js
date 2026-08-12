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
        msg.channel.send("Please specify a valid positive bet amount.");
        return;
    }

    if ((user.money || 0) < bet) {
        msg.channel.send(`You do not have enough currency to place a bet of **${bet} ${currencySymbol}**!`);
        return;
    }

    if (subCommand === 'coinflip') {
        const choice = (args[1] || 'heads').toLowerCase();
        if (choice !== 'heads' && choice !== 'tails') {
            msg.channel.send("Please choose `heads` or `tails`. Example: `ougi coinflip 50 heads`.");
            return;
        }
        const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
        const won = choice === outcome;
        if (won) { user.money += bet; } else { user.money -= bet; }
        db.saveUser(guildId, userId, user);

        const embed = new EmbedBuilder()
            .setTitle("🪙 Coinflip Result")
            .setDescription(`The coin landed on **${outcome.toUpperCase()}**!\nYou ${won ? `WON **${bet} ${currencySymbol}**! 🎉` : `LOST **${bet} ${currencySymbol}**! 💀`}\nNew balance: **${user.money} ${currencySymbol}**`)
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

        const embed = new EmbedBuilder()
            .setTitle("🎰 Slot Machine")
            .setDescription(`[ ${reel1} | ${reel2} | ${reel3} ]\n\n${winnings > 0 ? `JACKPOT! You won **${winnings} ${currencySymbol}**! 🎉` : `No match! You lost **${bet} ${currencySymbol}**. 💀`}\nNew balance: **${user.money} ${currencySymbol}**`)
            .setColor(winnings > 0 ? "#FFD700" : "#FF0000");

        msg.channel.send({ embeds: [embed] });
        return;
    }

    if (subCommand === 'gamble') {
        const userRoll = Math.floor(Math.random() * 100) + 1;
        const won = userRoll > 55;
        if (won) { user.money += bet; } else { user.money -= bet; }
        db.saveUser(guildId, userId, user);

        const embed = new EmbedBuilder()
            .setTitle("🎲 High-Roll Gamble")
            .setDescription(`You rolled a **${userRoll}/100** (Needed > 55 to win).\nYou ${won ? `WON **${bet} ${currencySymbol}**! 🎉` : `LOST **${bet} ${currencySymbol}**! 💀`}\nNew balance: **${user.money} ${currencySymbol}**`)
            .setColor(won ? "#00FF00" : "#FF0000");

        msg.channel.send({ embeds: [embed] });
    }
};

