module.exports = async function (arguments, msg) {
    if (msg.channel.type !== Discord.ChannelType.GuildText) {
        msg.channel.send(await ougi.text(msg, "mustGuild"));
        return
    }

    let elAdmin = msg.guild.ownerId;

    if (elAdmin != msg.author.id) {
        msg.channel.send(await ougi.text(msg, "mustOwn"));
        return
    }

    const subcommand = arguments[0].toLowerCase();
    if (subcommand !== 'create' && subcommand !== 'delete') {
        msg.channel.send((await ougi.text(msg, "invalidOption")) + "\ncreate, delete");
        return;
    }

    if (!settingsOBJ.shortcuts[msg.guildId]) {
        settingsOBJ.shortcuts[msg.guildId] = {};
    }

    if (subcommand === 'create') {
        const emoji = arguments[1];
        let action = arguments.slice((() => {
            switch (arguments[2].toLowerCase()) {
                case 'ougi':
                case '扇':
                case client.user.toString():
                case settingsOBJ.prefix[msg.guildId]:
                    return 3;
                    break;
                default:
                    return 2;
                    break;
            }
        })()).join(" ").toLowerCase();

        let emojiKey = null;
        let emojiId = null;
        let emojiName = null;
        let animated = false;

        const customEmojiMatch = emoji.match(/^<(a?):([a-zA-Z0-9_]+):(\d+)>$/);

        if (customEmojiMatch) {
            animated = customEmojiMatch[1] === 'a';
            emojiName = customEmojiMatch[2];
            emojiId = customEmojiMatch[3];
            emojiKey = emojiId;
        } else {
            // Assume raw unicode emoji
            emojiKey = emoji;
            // Validate that emojiKey is a valid Unicode emoji
            if (!/\p{Extended_Pictographic}/u.test(emojiKey)) {
                msg.channel.send(await ougi.text(msg, "mustEmoji"));
                return;
            }
            // Reject if input starts and ends with ':' (e.g., :sunglasses:)
            if (emojiKey.startsWith(':') && emojiKey.endsWith(':')) {
                msg.channel.send(await ougi.text(msg, "mustEmoji"));
                return;
            }
            emojiId = null;
            emojiName = emoji;
            animated = false;
        }

        if (!emojiKey) {
            msg.channel.send(await ougi.text(msg, "mustEmoji"));
            return;
        }

        settingsOBJ.shortcuts[msg.guildId][emojiKey] = {
            "action": action,
            "creator": msg.author.id,
            "timestamp": Date.now(),
            "emojiId": emojiId,
            "emojiName": emojiName,
            "animated": animated
        };

        await ougi.backup(database.settings.file, channels.settings);

        msg.channel.send(await ougi.text(msg, "shortcutCreated"));
    }
    else if (subcommand === 'delete') {
        const emoji = arguments[1];
        let emojiKey = null;

        const customEmojiMatch = emoji.match(/^<(a?):([a-zA-Z0-9_]+):(\d+)>$/);

        if (customEmojiMatch) {
            emojiKey = customEmojiMatch[3];
        } else {
            // Assume raw unicode emoji
            emojiKey = emoji;
            if (!/\p{Extended_Pictographic}/u.test(emojiKey)) {
                msg.channel.send(await ougi.text(msg, "mustEmoji"));
                return;
            }
        }

        if (!settingsOBJ.shortcuts[msg.guildId][emojiKey]) {
            msg.channel.send(await ougi.text(msg, "notExist"));
            return;
        }

        delete settingsOBJ.shortcuts[msg.guildId][emojiKey];

        await ougi.backup(database.settings.file, channels.settings);

        msg.channel.send(await ougi.text(msg, "shortcutDeleted"));
    }
}