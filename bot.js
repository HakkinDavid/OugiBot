const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("Minecraft")
});

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return
    }

    if (receivedMessage.content.startsWith("ougi")) {
        processCommand(receivedMessage)
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[1] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(2) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "multiply") {
        multiplyCommand(arguments, receivedMessage)
    } else {
        receivedMessage.channel.send("Huh~")
    }
}

function helpCommand(arguments, receivedMessage) {
    if (arguments == 'multiply') {
        receivedMessage.channel.send("I'll gladly multiply the numbers you provide me as long you input more than two values, and only if you promise me to study math.")
    } else {
        receivedMessage.channel.send("Could you be more specific? Try asking *me* for `help [topic]`")
    }
}

function multiplyCommand(arguments, receivedMessage) {
    if (arguments.length < 2) {
        receivedMessage.channel.send("It's unfair! Provide me (at least) 2 values. Try asking *me* to `multiply 9000 1 10` or `!multiply 1.5 2`")
        return
    }
    let product = 1
    arguments.forEach((value) => {
        product = product * parseFloat(value)
    })
    receivedMessage.channel.send("The product of " + arguments + " multiplied together is: " + product.toString())
}

client.on('message', msg => {
  if (msg.author == client.user) { // Prevent bot from responding to its own messages
      return
  }
  if (msg.content.startsWith('hi ougi'||'Hello, Ougi'||'Hi Ougi'||'Hi, Ougi'||'hello ougi')) {
    msg.reply('hello!');
  }

});

client.login(auth.token);
