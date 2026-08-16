const CryptoJS = require('crypto-js');

module.exports =

async function (msg) {
    if (!msg || typeof msg == "undefined" || typeof client == "undefined") return;
    let crypted_content = CryptoJS.AES.encrypt(msg.content, process.env.CRYPT_KEY).toString();
    let embed = new Discord.EmbedBuilder()
    .setColor("#FF008C")
    .setFooter({text: await ougi.text({ lang: 'en', stringID: "log_globalEmbedFooter" }), icon: client.user.avatarURL({dynamic: true, size: 4096})})
    .setTimestamp();
    if (typeof msg === "string") {
        embed.setAuthor({name: await ougi.text({ lang: 'en', stringID: "log_authorConsole" }), icon: client.user.avatarURL({dynamic: true, size: 4096})}).setDescription(msg.slice(0, 4096));
    }
    else {
        const authorName = msg.author?.username || "Unknown";
        const authorId = msg.author?.id || "Unknown";
        const authorAvatar = msg.author?.avatarURL ? msg.author.avatarURL({dynamic: true, size: 4096}) : client.user.avatarURL({dynamic: true, size: 4096});
        embed.setAuthor({name: authorName, icon: authorAvatar}).setDescription("ID `" + authorId + "`");
        
        const contentFieldName = await ougi.text({ lang: 'en', stringID: "log_contentField" });
        if (crypted_content && crypted_content.length > 0) {
            let trimmed = crypted_content;
            let first = true;
            while (trimmed.length > 0 && (!embed.data.fields || embed.data.fields.length < 24)) {
                const chunk = trimmed.slice(0, 1024);
                embed.addFields({name: first ? contentFieldName : "\u200b", value: chunk || "\u200b"});
                trimmed = trimmed.slice(1024);
                first = false;
            }
        } else {
            embed.addFields({name: contentFieldName, value: await ougi.text({ lang: 'en', stringID: "log_contentEmpty" })});
        }

        const chType = msg.channel?.type ?? "Unknown";
        const chId = msg.channel?.id ?? "Unknown";
        const channelInfoVal = await ougi.text({
            lang: 'en',
            stringID: "log_channelInfoValue",
            values: {
                type: chType,
                id: chId
            }
        });
        embed.addFields({name: await ougi.text({ lang: 'en', stringID: "log_channelInfoField" }), value: channelInfoVal});
    }

    const logChannel = client.channels.cache.get(consoleLogging);
    if (logChannel) {
        logChannel.send({embeds: [embed]}).catch(console.error);
    }
}
