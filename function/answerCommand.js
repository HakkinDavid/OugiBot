module.exports =

async function (arguments, msg) {
    var options = ["Yes", "No", "Yeah", "Nah", "Maybe", "Maybe not", "I guess", "I guess not", "I don't know, so I can't actually answer.", "I'm not sure.", "Ask someone else.", "Negative", "Negative multiplied by negative.", "Pancakes", "**Impossible**", "I don't know, but you do.", "Do you really want me to answer that?", "Uhhh"]
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
    client.channels.cache.get(consoleLogging).send("**Replied**\n> " + response);
}
