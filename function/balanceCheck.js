module.exports =

    async function (arguments, msg) {
        if (!(await ougi.guildCheck(msg))) return;

        if (!settingsOBJ.economy.hasOwnProperty(msg.guildId)) {
            msg.channel.send("Economy is not enabled in this Discord server.");
            return
        }

        let user = msg.author;

        if (msg.mentions.users.first()) {
            user = msg.mentions.users.first();
        }
        else if (arguments.length > 0) {
            msg.channel.send("Please specify a valid user.");
            return
        }

        if (!settingsOBJ.economy[msg.guildId].users.hasOwnProperty(user.id)) {
            settingsOBJ.economy[msg.guildId].users[user.id] = {
                money: 0,
                inventory: [],
                level: 0,
                xp: 0,
                badges: []
            };
        }

        let embed = new Discord.EmbedBuilder()
            .setTitle(user.username)
            .setColor("#022B46")
            .setThumbnail(user.avatarURL({ dynamic: true, size: 4096 }))
            .setDescription("**Balance:** " + settingsOBJ.economy[msg.guildId].currency + settingsOBJ.economy[msg.guildId].users[user.id].money + "\n**Level:** " + settingsOBJ.economy[msg.guildId].users[user.id].level + "\n[" + settingsOBJ.economy[msg.guildId].users[user.id].xp + "/" + (512 * (settingsOBJ.economy[msg.guildId].users[msg.author.id].level + 1)) + " " + settingsOBJ.economy[msg.guildId].xp + "]")
            .addFields({ name: "\u200b", value: "Items in inventory: " + settingsOBJ.economy[msg.guildId].users[user.id].inventory.length })
            .setFooter({ text: "economySystem by Ougi", icon: client.user.avatarURL({ dynamic: true, size: 4096 }) });

        msg.channel.send({ embeds: [embed] });
    }