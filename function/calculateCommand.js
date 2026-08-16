const { EmbedBuilder } = require('discord.js');
const math = require('mathjs');

module.exports = async function calculateCommand(args, msg) {
    if (!args.length) {
        const errorText = await ougi.text({ msg, stringID: "mathCommand_noInput" });
        msg.channel.send(errorText).catch(console.error);
        return;
    }

    const expression = args.join(' ');

    let result;
    try {
        // Evaluacion segura usando mathjs (previene arbitrario JS execution)
        result = math.evaluate(expression);
        if (typeof result === 'function' || typeof result === 'undefined') {
            throw new Error('Invalid calculation');
        }
        if (typeof result === 'object' && result.isResultSet) {
            result = result.entries.join(', ');
        }
    } catch (err) {
        const invalidText = await ougi.text({ msg, stringID: "mathCommand_invalidExpression" });
        msg.channel.send(invalidText).catch(console.error);
        return;
    }

    const options = [
        await ougi.text({ msg, stringID: "math_prefix1" }),
        await ougi.text({ msg, stringID: "math_prefix2" }),
        await ougi.text({ msg, stringID: "math_prefix3" }),
        await ougi.text({ msg, stringID: "math_prefix4" })
    ];
    const responsePrefix = options[Math.floor(Math.random() * options.length)];

    const embed = new EmbedBuilder()
        .setColor("#00FF99")
        .setTitle(await ougi.text({ msg, stringID: "mathCommand_resultTitle" }))
        .setDescription(`${responsePrefix}${result}`)
        .setFooter({ text: await ougi.text({ msg, stringID: "math_footer", values: { expression } }) });

    msg.channel.send({ embeds: [embed] }).catch(console.error);
    client.channels.cache.get(consoleLogging)?.send(`**Replied**\n> ${responsePrefix}${result}`);
};
