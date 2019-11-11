const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json')
require('http').createServer().listen(3000)

client.on('ready', () => {
  var options = ["Ougi: hi", "Ougi: ohayou", "Ougi: baka", "Ougi: hey there!", "Ougi: ola bb", "Ougi joins the battle!", "Creeper. \nOugi: Aw man"];
  var response = options[Math.floor(Math.random()*options.length)];
  console.log(response)
  var doing = ["Minecraft", "Fortnite", "Destiny 2", "Portal", "Portal 2", "Project 64", "osu!", "Geometry Dash", "Slime Rancher", "Left 4 Dead 2", "Transformice", "Grand Theft Auto V", "Team Fortress 2", "Overwatch", "Undertale", "Dolphin", "Ultimate Custom Night", "Minecraft Windows 10 Edition", "Terraria", "Roblox", "Paladins", "Tom Clancy's Rainbow Six Siege"]
  var something = doing[Math.floor(Math.random()*doing.length)];
  client.user.setActivity(something)
  console.log("I'm playing " + something)
});

client.on('message', (msg) => {
    if (msg.author == client.user) { // Prevent bot from responding to its own messages
        return
    }

    if (msg.content.toLowerCase().startsWith("ougi") && !msg.author.bot) {
        processCommand(msg)
    }
})

function processCommand(msg) {
    var fullCommand = msg.content.substr(4) // Remove Ougi's name
    var splitCommand = fullCommand.toLowerCase().split(" ") // Split the message up in to pieces for each space
    var primaryCommand = splitCommand[1] // The first word directly after Ougi's name is the command
    var arguments = splitCommand.slice(2) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments

    if (primaryCommand == "help") {
        helpCommand(arguments, msg)
    } else if (primaryCommand == "multiply") {
        multiplyCommand(arguments, msg)
    } else if (primaryCommand == "add") {
        additionCommand(arguments, msg)
    } else if (primaryCommand == "say") {
        sayCommand(arguments, msg)
    } else if (primaryCommand == "answer") {
        answerCommand(arguments, msg)
    } else if (primaryCommand == "now"){
        nowCommand(arguments, msg)
    } else if (primaryCommand == "meme") {
        memeCommand(arguments, msg)
    } else if (primaryCommand == "embed") {
        embedCommand(arguments, msg)
    } else if (primaryCommand == "flushed") {
        var options = [":flushed:", "<:clownflushed:630142296293376060>", "<:coolflushed:638924603107967007>", "<:cowboyflushed:638925102238400512>", "<:eggflushed:638924893907451946>"];
        var response = options[Math.floor(Math.random()*options.length)];
        msg.channel.send(response).then().catch(console.error);
    } else if (primaryCommand == undefined) {
        var options = ["I don't get it.", "What do you mean?", "Baka.", "Oh.", "Nani", "Nande"];
        var response = options[Math.floor(Math.random()*options.length)];
        msg.channel.send(response).then().catch(console.error);
    } else {
        var badWord = ["nigga", "faggot", "fuck", "nigger", "baka", "stupid", "dumb", "hentai", "shit", "fucking", "idiot", "silly", "ass", "retard", "whore", "gay"]
        for (var i = 0; i < badWord.length; i++) {
            if (msg.content.includes(badWord[i])) {
              var options = ["no u", "you're a bad word", "then you uhhhhh you're a fortniter", "<:nou:638908430899478540>", "<:reverse:638908430878507018>"];
              var response = options[Math.floor(Math.random()*options.length)];
              msg.channel.send(response).then().catch(console.error);
              break;
            }
        }
    }
}

function helpCommand(arguments, msg) {
    if (arguments == 'list') {
        msg.channel.send("As of now, I can help you with these topics: `multiply`, `add`, `say`, `answer`, `now`, `meme`, `embed` and `prefix`. Still improving!");
    } else if (arguments == 'multiply') {
        msg.channel.send("I'll gladly multiply the numbers you provide me as long you input more than two values, and only if you promise me to study math: `multiply [value] [value] ...`.");
    } else if (arguments == 'add') {
        msg.channel.send("I'll do additions for you! Ask *me* to `add [value] [value] ...`.");
    } else if (arguments == 'say') {
        msg.channel.send("Do you want me to say something? Just ask *me* to `say [message]`.");
    } else if (arguments == 'answer') {
        msg.channel.send("Are you curious about my opinion? Ask *me* to `answer [question]`.");
    } else if (arguments == 'now') {
        msg.channel.send("If you want to know how I'm feeling or what I'm doing, just tell *me* `now`");
    } else if (arguments == 'meme'){
        const attachment = new Discord.Attachment("./images/memehelp.png");
        msg.channel.send(attachment).then().catch(console.error);
    } else if (arguments == 'embed'){
        msg.channel.send('Do you want to make some cool embeds? Try asking *me* ```embed [url] `[title]` [description]```');
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
        msg.channel.send("It's not fair! Provide me (at least) 2 values. Try asking *me* to `multiply 9000 1 10` or `multiply 1.5 2`")
        return
    }
    let inputValues = 1
    arguments.forEach((value) => {
        inputValues = inputValues * parseFloat(value)
    })
    var options = ["It's ", "We get ", "I think it is ", "The resulting value is "];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response + inputValues.toString());
}

function additionCommand(arguments, msg) {
    if (arguments.length < 2) {
        msg.channel.send("It's not fair! Provide me (at least) 2 values. Try asking *me* to `add 4500 4501` or `add 1.2 2.3`")
        return
    }
    let inputValues = 0
    arguments.forEach((value) => {
        inputValues = inputValues + parseFloat(value)
    })
    var options = ["It's ", "We get ", "I think it is ", "The resulting value is "];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response + inputValues.toString());
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
    var options = ["I'm feeling happy. What about you?", "I'm craving some food.", "It's a beatiful day outside, don't you think so? Flowers are singing, birds are blooming. *Wait, I screwed it up.*", "I'm just having an existential crisis: Does the Lighting McQueen have life insurance or car insurance?", "I'm eating some popcorns.", "I'm planning a way to defeat all those zombies around my Minecraft house.", "I'm *doing homework* but I should be doing homework.", "Have you ever played a videogame world cup and ranked first place? Neither me, but I'm making some coffee.", "I'm having a déjà vu.", "I was reading a book, called 'sʞooq pɐǝɹ oʇ ʍoH', I didn't understand a single word.", "Yesterday, I was back in the mine, got my pickaxe swinging from side to side, hoping to find some diamonds. When I thought I was safe, I overheard some hissing from right behind. Aw man.", "Hate me or love me, I tried playing Fortnite. Apparently I have to download it.", "I saw some memes today.", "I'm bored.", "I'm having a headache.", "I'm online.", "I feel confused, is a *taco* the same thing as a *sope* or an *enchilada*? I mean after all these are *tortillas* with stuff like meat or cheese.", "I'm kinda sad. My ice cream melted before I even tasted it.", "I want to know why roses are red and violets are blue.", "Is life made of 5 protons or why is it so Boron?", "I'm glad to have someone talking to me.", "I heard the convenience store is selling [愛] love. Can you lend me 298 yen?"];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
}

function memeCommand(arguments, msg) {
    var call = arguments[0];
    if (call == "list") {
      var number = arguments[1];
      var memelist = ["I am inevitable [ID: Inevitable]", "Impossible", "Wallace", "Yes", "Everything", "Did you do it? [ID: Didyoudoit]", "What did it cost? [ID: Whatdiditcost]", "Failure Snap [ID: Failuresnap]", "No", "Too late, 15 years too late. [ID: toolate]"];
      if (number == "2") {
        msg.channel.send("Ougi's Meme List (Page 2):\n\`\`\`" + memelist.sort().slice(9).join("\n") + "\`\`\`")
      }
      else {
        msg.channel.send("Ougi's Meme List (Page 1):\n\`\`\`" + memelist.sort().slice(0, 10).join("\n") + "\`\`\`")
      }
    }
    else {
        const attachment = new Discord.Attachment("./images/"+ call + ".png");
        msg.channel.send(attachment).then().catch(console.error);
    }
}

function embedCommand(arguments, msg) {
    if (arguments.length == 0){
      msg.channel.send("Do you need some help making an embed? Take a look at `help embed`.");
      return
    }
    var fullCommand = msg.content.substr(4); // Remove Ougi's name
    var splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
    var primaryCommand = splitCommand[1]; // The first word directly after Ougi's name is the command
    var arguments = splitCommand.slice(2); // All other words are arguments/parameters/options for the command
    var newArgs = arguments.join(" ").toString();
    var newArguments = newArgs.split('`');
    var url = arguments[0];
    var title = newArguments[1];
    var description = newArguments.slice(2);
    var colors = ["#00AE86"];
    var colorEmbed = colors[Math.floor(Math.random()*colors.length)];

    if (newArguments[2] == undefined){
      msg.channel.send("Remember to add an URL, to write your embed's title between these `` and to add a description.");
      return
    }
    
    msg.channel.send({embed: {
    color: 3447003,
    author: {
      name: msg.author.username,
      icon_url: msg.author.avatarURL
    },
    title: title,
    url: url,
    description: description.join("`").toString(),
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "SpookyEmbed by Ougi"
    }
  }
}).then().catch(console.error);
}

client.on('message', msg => {
    if (msg.author == client.user) { // Prevent bot from responding to its own messages
        return
    }
    if (msg.content.toLowerCase().startsWith('hi ougi') || msg.content.toLowerCase().startsWith('hello ougi')) {
      var options = ["Hello", "Hi", "Hey!", ":flushed:", "<:clownflushed:630142296293376060>", "ola bb"];
      var response = options[Math.floor(Math.random()*options.length)];
      msg.channel.send(response).then().catch(console.error);
    }
    if (msg.content.toLowerCase().startsWith('bye ougi') || msg.content.toLowerCase().startsWith('goodbye ougi')) {
      var options = ["See you later!", "Sayonara", "Goodbye", "Oh, bye."];
      var response = options[Math.floor(Math.random()*options.length)];
      msg.channel.send(response).then().catch(console.error);
    }
    if (msg.content.toLowerCase().startsWith('ola bb')) {
      var options = ["ola bb", "ola", "k pasa bb", "ontas¿"];
      var response = options[Math.floor(Math.random()*options.length)];
      msg.channel.send(response).then().catch(console.error);
    }
});

client.login(auth.token);
