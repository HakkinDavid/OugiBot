module.exports =

    async function (arguments, msg) {
        if (!(await ougi.guildCheck(msg))) return;

        const db = ougi.db();
        const guildEco = db.getGuildEconomy(msg.guildId);

        if (guildEco.disabled) {
            msg.channel.send(await ougi.text(msg, "economy_disabled"));
            return;
        }

        let user = msg.author;

        if (msg.mentions.users.first()) {
            user = msg.mentions.users.first();
        }
        else if (arguments.length > 0) {
            msg.channel.send(await ougi.text(msg, "balance_invalidUser"));
            return;
        }

        const userData = db.getUser(msg.guildId, user.id);
        const inventory = db.getUserInventory(msg.guildId, user.id);
        const nextLevel = 512 * (userData.level + 1);

        const descTemplate = await ougi.text(msg, "balance_desc");
        const renderedDesc = descTemplate
            .replace(/{currency}/g, guildEco.currency)
            .replace(/{money}/g, userData.money)
            .replace(/{level}/g, userData.level)
            .replace(/{xp}/g, userData.xp)
            .replace(/{nextLevel}/g, nextLevel)
            .replace(/{xp_label}/g, guildEco.xp_label);

        const inventoryFieldTemplate = await ougi.text(msg, "balance_inventory");

        let embed = new Discord.EmbedBuilder()
            .setTitle(user.username)
            .setColor("#022B46")
            .setThumbnail(user.avatarURL({ dynamic: true, size: 4096 }))
            .setDescription(renderedDesc)
            .addFields({ name: "\u200b", value: inventoryFieldTemplate.replace(/{count}/g, inventory.length) })
            .setFooter({ text: await ougi.text(msg, "balance_footer"), iconURL: client.user.avatarURL({ dynamic: true, size: 4096 }) });

        msg.channel.send({ embeds: [embed] });
    }