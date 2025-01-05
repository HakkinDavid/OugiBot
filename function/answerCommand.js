module.exports =

async function (msg, replied_to_ougi) {
    let options = ["yes", "no", "yeah", "nah", "maybe", "maybeNot", "guess", "guessNot", "idk", "notSure", "askSomeone", "negative", "squareNegative", "pancakes", "impossible", "notWhoKnows", "skipQuestion", "uh"];
    let response = await ougi.text(msg, options[Math.floor(Math.random()*options.length)]);
    if (replied_to_ougi) { msg.reply(response).catch(console.error); }
    else { msg.channel.send(response).catch(console.error); }
    client.channels.cache.get(consoleLogging).send("**Replied**\n> " + response);
}
