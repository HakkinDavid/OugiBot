module.exports =

async function (arguments, msg) {
    if (!msg.reference.messageId) {
        msg.reply("You should reply to a message for me to react.");
        return;
    }
    if (arguments.length < 1) {
        msg.reply("You didn't tell me what to react!");
        return;
    }
    try {
        (await msg. channel.messages.fetch(msg.reference. messageId)).react(arguments[0]);
        msg.channel.send("I have reacted " + arguments[0] + "!");
    }
    catch (e) {
        msg.reply("Sorry. Couldn't react to that message.");
    }
}