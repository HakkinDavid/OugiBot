const { EmbedBuilder } = require('discord.js');

module.exports = async function calculateCommand(args, msg) {
    if (!args.length) {
        const errorText = await ougi.text(msg, "mathCommand_noInput");
        msg.channel.send(errorText).catch(console.error);
        return;
    }

    const expression = args.join(' ');

    let result;
    try {
        // Evaluación segura básica usando Function constructor
        result = Function(`"use strict"; return (${expression})`)();
        if (typeof result !== 'number' || !isFinite(result)) throw new Error('Invalid calculation');
    } catch (err) {
        const invalidText = await ougi.text(msg, "mathCommand_invalidExpression");
        msg.channel.send(invalidText).catch(console.error);
        return;
    }

    const options = ["It's ", "We get ", "I think it is ", "The resulting value is "];
    const responsePrefix = options[Math.floor(Math.random() * options.length)];

    const embed = new EmbedBuilder()
        .setColor("#00FF99")
        .setTitle(await ougi.text(msg, "mathCommand_resultTitle"))
        .setDescription(`${responsePrefix}${result}`)
        .setFooter({ text: `Expression: ${expression}` });

    msg.channel.send({ embeds: [embed] }).catch(console.error);
    client.channels.cache.get(consoleLogging)?.send(`**Replied**\n> ${responsePrefix}${result}`);
}
