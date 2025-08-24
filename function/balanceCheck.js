module.exports =

    async function (arguments, msg) {
        if (msg.channel.type !== Discord.ChannelType.GuildText) {
            msg.channel.send(await ougi.text(msg, "mustGuild"));
            return
        }

        if (!settingsOBJ.economy.hasOwnProperty(msg.guild.id)) {
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

        if (!settingsOBJ.economy[msg.guild.id].users.hasOwnProperty(user.id)) {
            settingsOBJ.economy[msg.guild.id].users[user.id] = {
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
            .setDescription("**Balance:** " + settingsOBJ.economy[msg.guild.id].currency + settingsOBJ.economy[msg.guild.id].users[user.id].money + "\n**Level:** " + settingsOBJ.economy[msg.guild.id].users[user.id].level + "\n[" + settingsOBJ.economy[msg.guild.id].users[user.id].xp + "/" + (512 * (settingsOBJ.economy[msg.guild.id].users[msg.author.id].level + 1)) + " " + settingsOBJ.economy[msg.guild.id].xp + "]")
            .addFields({ name: "\u200b", value: "Items in inventory: " + settingsOBJ.economy[msg.guild.id].users[user.id].inventory.length })
            .setFooter({ text: "economySystem by Ougi", icon: client.user.avatarURL({ dynamic: true, size: 4096 }) });

        msg.channel.send({ embeds: [embed] });
    }