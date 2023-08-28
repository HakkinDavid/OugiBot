module.exports =

async function (msg) {
    let crypted_content = CryptoJS.AES.encrypt(msg.content, process.env.CRYPT_KEY).toString();
    let embed = new Discord.EmbedBuilder()
    .setColor("#FF008C")
    .setFooter({text: "globalLogEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})})
    .setTimestamp();
    if (typeof msg === "string") {
        embed.setAuthor({name: "Ougi through Console Log", icon: client.user.avatarURL({dynamic: true, size: 4096})}).setDescription(msg);
    }
    else {
        embed.setAuthor({name: msg.author.username, icon: msg.author.avatarURL({dynamic: true, size: 4096})}).setDescription("ID `" + msg.author.id + "`");
        if (msg.content.length > 1024) {
            embed.addFields({name: "Content", value: crypted_content.slice(0, 1023)});
            let trimmed = crypted_content.slice(1023);
            while (trimmed.length > 0) {
                embed.addFields({name: "\u200b", value: trimmed.slice(0, 1023)});
                trimmed = trimmed.slice(1023);
            }
        }
        else {
            embed.addFields({name: "Content", value: crypted_content});
        }
        embed.addFields({name: "Channel info", value: "Type: `" + msg.channel.type + "`\nID: `" + msg.channel.id + "`"});
    }

    client.channels.cache.get(consoleLogging).send({embeds: [embed]});
    global.logsCount++;
}
