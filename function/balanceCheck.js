module.exports =

    async function (arguments, msg) {
        if (!(await ougi.guildCheck(msg))) return;

        const db = ougi.db();
        const guildEco = db.getGuildEconomy(msg.guildId);

        if (guildEco.disabled) {
            msg.channel.send(await ougi.text({ msg, stringID: "economy_disabled" }));
            return;
        }

        let user = msg.author;

        if (msg.mentions.users.first()) {
            user = msg.mentions.users.first();
        }
        else if (arguments.length > 0) {
            msg.channel.send(await ougi.text({ msg, stringID: "balance_invalidUser" }));
            return;
        }

        const userData = db.getUser(msg.guildId, user.id);
        const inventory = db.getUserInventory(msg.guildId, user.id);
        const nextLevel = 512 * (userData.level + 1);

        const renderedDesc = await ougi.text({
            msg,
            stringID: "balance_desc",
            values: {
                currency: guildEco.currency,
                money: userData.money,
                level: userData.level,
                xp: userData.xp,
                nextLevel: nextLevel,
                xp_label: guildEco.xp_label
            }
        });

        let embed = new Discord.EmbedBuilder()
            .setTitle(user.username)
            .setColor("#022B46")
            .setThumbnail(user.avatarURL({ dynamic: true, size: 4096 }))
            .setDescription(renderedDesc)
            .addFields({ name: "\u200b", value: await ougi.text({ msg, stringID: "balance_inventory", values: { count: inventory.length } }) })
            .setFooter({ text: await ougi.text({ msg, stringID: "balance_footer" }), iconURL: client.user.avatarURL({ dynamic: true, size: 4096 }) });

        msg.channel.send({ embeds: [embed] });
    }