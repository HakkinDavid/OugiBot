module.exports =

function (arguments, msg) {
    if (arguments.length < 2) {
        msg.channel.send("It's not fair! Provide me (at least) 2 values. Try asking *me* to `add 4500 4501` or `add 1.2 2.3`").then().catch(console.error);
        return
    }
    let inputValues = 0
    arguments.forEach((value) => {
        inputValues = inputValues + parseFloat(value)
    })
    var options = ["It's ", "We get ", "I think it is ", "The resulting value is "];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response + inputValues.toString()).then().catch(console.error);
    client.channels.get(consoleLogging).send("**Replied**\n> " + response + inputValues.toString());
}
