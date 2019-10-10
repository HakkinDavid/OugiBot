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
    var arguments = splitCommand.slice(2) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments

    if (primaryCommand == "help") {
        helpCommand(arguments, msg)
    } else if (primaryCommand == "multiply") {
        multiplyCommand(arguments, msg)
    } else if (primaryCommand == "say") {
        sayCommand(arguments, msg)
    } else if (primaryCommand == "answer") {
        answerCommand(arguments, msg)
    } else if (primaryCommand == "now"){
        nowCommand(arguments, msg)
    } else {
        msg.channel.send("Huh~")
    }
}

function helpCommand(arguments, msg) {
    if (arguments == 'list') {
        msg.channel.send("As of now, I can help you with these topics: `multiply`, `say`, `answer`, `now` and `prefix`. Still improving!")
    } else if (arguments == 'multiply') {
        msg.channel.send("I'll gladly multiply the numbers you provide me as long you input more than two values, and only if you promise me to study math: `multiply [value] [value] ...`.")
    } else if (arguments == 'say') {
        msg.channel.send("Do you want me to say something? Just ask *me* to `say [message]`.")
    } else if (arguments == 'answer') {
        msg.channel.send("Are you curious about my opinion? Ask *me* to `answer [question]`.")
    } else if (arguments == 'now') {
        msg.channel.send("If you want to know how I'm feeling or what I'm doing, just tell *me* `now`")
    } else if (arguments == 'prefix') {
        msg.channel.send("Just call me by my name!")
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

function sayCommand(arguments, msg) {
    const sayMessage = arguments.join(" ");
    msg.delete().catch(O_o=>{});
    msg.channel.send(sayMessage);

}

function answerCommand(arguments, msg) {
    var options = ["Yes", "No", "Yeah", "Nah", "Maybe", "Maybe not", "I guess", "I guess not", "I don't know, so I can't actually answer.", "I'm not sure.", "Ask someone else.", "Negative", "Negative multiplied by negative.", "Pancakes", "*Impossible*", "I don't know, but you do.", "Do you really want me to answer that?", "Uhhh"]
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
}

function nowCommand(arguments, msg) {
    var options = ["I'm feeling happy. What about you?", "I'm craving some food.", "It's a beatiful day outside, don't you think so? Flowers are singing, birds are blooming. *Wait, I screwed it up.*", "I'm just having an existential crisis: Does the Lighting McQueen have life insurance or car insurance?", "I'm eating some popcorns.", "I'm planning a way to defeat all those zombies around my Minecraft house.", "I'm *doing homework* but I should be doing homework.", "Have you ever played a videogame world cup and ranked first place? Neither me, but I'm making some coffee.", "I'm having a déjà vu.", "I was reading a book, called 'sʞooq pɐǝɹ oʇ ʍoH', I didn't understand a single word.", "Yesterday, I was back in the mine, got my pickaxe swinging from side to side, hoping to find some diamonds. When I thought I was safe, I overheard some hissing from right behind. Aww man.", "Hate me or love me, I tried playing Fortnite. Apparently I have to download it.", "I saw some memes today.", "I'm bored.", "I'm having a headache.", "I'm online.", "I feel confused, is a *taco* the same thing as a *sope* or an *enchilada*? I mean after all these are *tortillas* with stuff like meat or cheese.", "I'm kinda sad. My ice cream melted before I even tasted it.", "I want to know why roses are red and violets are blue.", "Is life made of 5 protons or why is it so Boron?", "I'm glad to have someone talking to me.", "I heard the convenience store is selling [愛] love. Can you lend me 298 yen?"]
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
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
