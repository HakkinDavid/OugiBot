const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

client.on('ready', () => {
  console.log(`${client.user.tag} joins the battle!`);
  client.user.setActivity("Minecraft")
});

client.on('message', (msg) => {
    if (msg.author == client.user) { // Prevent bot from responding to its own messages
        return
    }

    if (msg.content.startsWith("ougi") || msg.content.startsWith("Ougi") && !msg.author.bot) {
        processCommand(msg)
    }
})

function processCommand(msg) {
    let fullCommand = msg.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[1] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(2) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments

    if (primaryCommand == "help") {
        helpCommand(arguments, msg)
    } else if (primaryCommand == "multiply") {
        multiplyCommand(arguments, msg)
    } else {
        msg.channel.send("Huh~")
    }
}

function helpCommand(arguments, msg) {
    if (arguments == 'list') {
        msg.channel.send("As of now, I can `multiply`. Still improving!")
    } else if (arguments == 'multiply') {
        msg.channel.send("I'll gladly multiply the numbers you provide me as long you input more than two values, and only if you promise me to study math.")
    } else if (arguments.length < 1) {
        var options = ["Could you be more specific? Try asking *me* for `help [topic]`. A good start would be `help list`.", "Do you need help? Try asking *me* for `help [topic]`. As an example, use `help list`.", "Is there anything I could help you with? Ask *me* for `help [topic]`. You could try `help list`."];
        var response = options[Math.floor(Math.random()*options.length)];
        msg.channel.send(response).then().catch(console.error);
    }
    else {
      var options = ["I don't get it.", "What do you mean?", "Word it right, baka."];
      var response = options[Math.floor(Math.random()*options.length)];
      msg.channel.send(response).then().catch(console.error);
    }
}

function multiplyCommand(arguments, msg) {
    if (arguments.length < 2) {
        msg.channel.send("It's not fair! Provide me (at least) 2 values. Try asking *me* to `multiply 9000 1 10` or `!multiply 1.5 2`")
        return
    }
    let product = 1
    arguments.forEach((value) => {
        product = product * parseFloat(value)
    })
    msg.channel.send("The product of " + arguments + " multiplied together is: " + product.toString())
}

client.on('message', msg => {
  if (msg.author == client.user) { // Prevent bot from responding to its own messages
      return
  }
  if (msg.content.startsWith('hi ougi') || msg.content.startsWith('Hi ougi') || msg.content.startsWith('Hi Ougi') || msg.content.startsWith('hello ougi') || msg.content.startsWith('Hello ougi') || msg.content.startsWith('Hello Ougi')) {
    var options = ["Hello", "Hi", "Hey!", ":flushed:", "<:clownflushed:630142296293376060>"];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
  }
  if (msg.content.startsWith('bye ougi') || msg.content.startsWith('Bye ougi') || msg.content.startsWith('Bye Ougi') || msg.content.startsWith('goodbye ougi') || msg.content.startsWith('Goodbye ougi') || msg.content.startsWith('Goodbye Ougi')) {
    var options = ["See you later!", "Sayonara", "Goodbye", "Oh, bye."];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
  }
});

client.login(auth.token);
