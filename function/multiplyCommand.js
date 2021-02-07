module.exports =

async function (arguments, msg) {
    if (arguments.length < 2) {
        msg.channel.send("It's not fair! Provide me (at least) 2 values. Try asking *me* to `multiply 9000 1 10` or `multiply 1.5 2`").catch(console.error);
        return
    }
    let inputValues = 1
    arguments.forEach((value) => {
        inputValues = inputValues * parseFloat(value)
    })
    var options = ["It's ", "We get ", "I think it is ", "The resulting value is "];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response + inputValues.toString()).catch(console.error);
    client.channels.cache.get(consoleLogging).send("**Replied**\n> " + response + inputValues.toString());
}
