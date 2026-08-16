module.exports =

async function (arguments, msg) {
    if (!msg.reference.messageId) {
        msg.reply(await ougi.text(msg, "react_replyNeeded"));
        return;
    }
    if (arguments.length < 1) {
        msg.reply(await ougi.text(msg, "react_tellWhat"));
        return;
    }
    try {
        (await msg.channel.messages.fetch(msg.reference.messageId)).react(arguments[0]);
        if (msg.id !== msg.reference.messageId) msg.delete();
    }
    catch (e) {
        msg.reply(await ougi.text(msg, "react_error"));
    }
}