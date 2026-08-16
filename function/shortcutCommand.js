module.exports = async function (arguments, msg) {
    if (!(await ougi.guildCheck(msg))) return;

    if (!(await ougi.adminCheck(msg))) return;

    const subcommand = arguments[0].toLowerCase();
    if (subcommand !== 'create' && subcommand !== 'delete') {
        msg.channel.send((await ougi.text({ msg, stringID: "invalidOption" })) + "\ncreate, delete");
        return;
    }

    const shortcuts = ougi.db().getShortcuts(msg.guildId);

    if (subcommand === 'create') {
        const emoji = arguments[1];
        let action = arguments.slice((() => {
            if (ougi.helperFunctions.checkForPrefixStr(arguments[2], msg.guildId)) {
                return 3;
            }
            return 2;
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
                msg.channel.send(await ougi.text({ msg, stringID: "mustEmoji" }));
                return;
            }
            // Reject if input starts and ends with ':' (e.g., :sunglasses:)
            if (emojiKey.startsWith(':') && emojiKey.endsWith(':')) {
                msg.channel.send(await ougi.text({ msg, stringID: "mustEmoji" }));
                return;
            }
            emojiId = null;
            emojiName = emoji;
            animated = false;
        }

        if (!emojiKey) {
            msg.channel.send(await ougi.text({ msg, stringID: "mustEmoji" }));
            return;
        }

        ougi.db().setShortcut(msg.guildId, emojiKey, {
            "action": action,
            "creator": msg.author.id,
            "timestamp": Date.now(),
            "emojiId": emojiId,
            "emojiName": emojiName,
            "animated": animated
        });

        msg.channel.send(await ougi.text({ msg, stringID: "shortcutCreated" }));
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
                msg.channel.send(await ougi.text({ msg, stringID: "mustEmoji" }));
                return;
            }
        }

        if (!shortcuts[emojiKey]) {
            msg.channel.send(await ougi.text({ msg, stringID: "notExist" }));
            return;
        }

        ougi.db().deleteShortcut(msg.guildId, emojiKey);

        msg.channel.send(await ougi.text({ msg, stringID: "shortcutDeleted" }));
    }
}