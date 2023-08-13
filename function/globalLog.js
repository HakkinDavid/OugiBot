module.exports =

async function (msg) {
    let embed = new Discord.MessageEmbed()
    .setColor("#FF008C")
    .setFooter("globalLogEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))
    .setTimestamp();
    if (typeof msg === "string") {
        embed.setAuthor("Ougi through Console Log", client.user.avatarURL({dynamic: true, size: 4096})).setDescription(msg);
    }
    else {
        embed.setAuthor(msg.author.username, msg.author.avatarURL({dynamic: true, size: 4096})).setDescription("ID `" + msg.author.id + "`");
        if (msg.content.length > 1024) {
            embed.addField("Content", msg.content.slice(0,1024));
            embed.addField("\u200b", msg.content.slice(1024));
        }
        else {
            embed.addField("Content", msg.content);
        }
        embed.addField("Channel info", "Type: `" + msg.channel.type + "`\nID: `" + msg.channel.id + "`");
    }

    client.channels.cache.get(consoleLogging).send({embed});
}
