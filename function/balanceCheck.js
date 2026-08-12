module.exports =

    async function (arguments, msg) {
        if (!(await ougi.guildCheck(msg))) return;

        const db = ougi.db();
        const guildEco = db.getGuildEconomy(msg.guildId);

        if (guildEco.disabled) {
            msg.channel.send("Economy is not enabled in this Discord server.");
            return;
        }

        let user = msg.author;

        if (msg.mentions.users.first()) {
            user = msg.mentions.users.first();
        }
        else if (arguments.length > 0) {
            msg.channel.send("Please specify a valid user.");
            return;
        }

        const userData = db.getUser(msg.guildId, user.id);
        const inventory = db.getUserInventory(msg.guildId, user.id);
        const nextLevel = 512 * (userData.level + 1);

        let embed = new Discord.EmbedBuilder()
            .setTitle(user.username)
            .setColor("#022B46")
            .setThumbnail(user.avatarURL({ dynamic: true, size: 4096 }))
            .setDescription(
                "**Balance:** " + guildEco.currency + userData.money +
                "\n**Level:** " + userData.level +
                "\n[" + userData.xp + "/" + nextLevel + " " + guildEco.xp_label + "]"
            )
            .addFields({ name: "\u200b", value: "Items in inventory: " + inventory.length })
            .setFooter({ text: "economySystem by Ougi", iconURL: client.user.avatarURL({ dynamic: true, size: 4096 }) });

        msg.channel.send({ embeds: [embed] });
    }