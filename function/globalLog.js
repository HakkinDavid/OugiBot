module.exports =

async function (msg) {
    let crypted_content = CryptoJS.AES.encrypt(msg.content, process.env.CRYPT_KEY).toString();
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
            embed.addField("Content", crypted_content.slice(0,1024));
            embed.addField("\u200b", crypted_content.slice(1024));
        }
        else {
            embed.addField("Content", crypted_content);
        }
        embed.addField("Channel info", "Type: `" + msg.channel.type + "`\nID: `" + msg.channel.id + "`");
    }

    client.channels.cache.get(consoleLogging).send({embed});
    global.logsCount++;
}
