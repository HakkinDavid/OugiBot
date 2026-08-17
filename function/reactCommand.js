module.exports = async function (arguments, msg) {
    if (!msg.reference?.messageId) {
        msg.reply(await ougi.text({ msg, stringID: "react_replyNeeded" })).catch(console.error);
        return;
    }
    if (!arguments || arguments.length < 1) {
        msg.reply(await ougi.text({ msg, stringID: "react_tellWhat" })).catch(console.error);
        return;
    }
    try {
        const targetMsg = await msg.channel.messages.fetch(msg.reference.messageId).catch(() => null);
        if (!targetMsg) {
            msg.reply(await ougi.text({ msg, stringID: "react_error" })).catch(console.error);
            return;
        }
        await targetMsg.react(arguments[0]);
        if (msg.id !== msg.reference.messageId && msg.delete) {
            msg.delete().catch(() => {});
        }
    }
    catch (e) {
        msg.reply(await ougi.text({ msg, stringID: "react_error" })).catch(console.error);
    }
};