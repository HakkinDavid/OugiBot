module.exports = async function answerCommand(msg, replied_to_ougi) {
  try {
    const options = [
      "yes", "no", "yeah", "nah", "maybe", "maybeNot", "guess", "guessNot",
      "idk", "notSure", "askSomeone", "negative", "squareNegative",
      "pancakes", "impossible", "notWhoKnows", "skipQuestion", "uh"
    ];

    const randomOption = options[Math.floor(Math.random() * options.length)];
    const response = await ougi.text(msg, randomOption);

    if (replied_to_ougi) {
      await msg.reply(response);
    } else {
      await msg.channel.send(response);
    }

    // Envía registro a canal de logs si existe
    if (typeof client !== 'undefined' && client.channels) {
      const logChannel = client.channels.cache.get(consoleLogging);
      if (logChannel) {
        await logChannel.send(`**Replied**\n> ${response}`);
      }
    }

  } catch (err) {
    console.error('Error en answerCommand:', err);
    await msg.channel.send(await ougi.text(msg, 'generalError'));
  }
};