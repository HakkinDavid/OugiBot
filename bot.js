require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const cheerio = require("cheerio");
const request = require("request");

const consoleLogging = "647348129078837254";

const logBackup = console.log;
const logMessages = [];

console.log = function() {
    logMessages.push.apply(logMessages, arguments);
    if (logMessages[0] == "\n"){
      client.channels.get(consoleLogging).send("**<:blank:647338810107101184>  **").then().catch(console.error);
      logMessages.pop();
    }
    else {
      client.channels.get(consoleLogging).send(logMessages.pop()).then().catch(console.error);
    }
    logBackup.apply(console, arguments);
};

client.on('ready', () => {
  var options = ["Ougi: hi", "Ougi: ohayou", "Ougi: baka", "Ougi: hey there!", "Ougi: ola bb", "Ougi joins the battle!", "Creeper. \nOugi: Aw man"];
  var response = options[Math.floor(Math.random()*options.length)];
  console.log(response)
  var doing = ["Minecraft", "Fortnite", "Destiny 2", "Portal", "Portal 2", "Project 64", "osu!", "Geometry Dash", "Slime Rancher", "Left 4 Dead 2", "Transformice", "Grand Theft Auto V", "Team Fortress 2", "Overwatch", "Undertale", "Dolphin", "Ultimate Custom Night", "Minecraft Windows 10 Edition", "Terraria", "Roblox", "Paladins", "Tom Clancy's Rainbow Six Siege"]
  var something = doing[Math.floor(Math.random()*doing.length)];
  client.user.setActivity(something)
  console.log("I'm playing " + something)
  console.log("\n")
});

client.on('message', (msg) => {
    if (msg.author == client.user) { // Prevent bot from responding to its own messages
        return
    }

    if (msg.content.toLowerCase().startsWith("ougi") && !msg.author.bot) {
        processCommand(msg);
    }

    else if (msg.content.toLowerCase().startsWith("#ougi") && !msg.author.bot) {
        rootCommands(msg);
    }

    else if (msg.channel.type == "dm") {
        talkAbility(msg);
    }
})

function processCommand(msg) {
    var fullCommand = msg.content.substr(4) // Remove Ougi's name
    var splitCommand = fullCommand.toLowerCase().split(" ") // Split the message up in to pieces for each space
    var primaryCommand = splitCommand[1] // The first word directly after Ougi's name is the command
    var arguments = splitCommand.slice(2) // All other words are arguments/parameters/options for the command

    var event = new Date();
    console.log("__**" + event.toLocaleTimeString('en-US') + "**__");
    console.log("Command received: " + primaryCommand);
    console.log("Arguments: " + arguments);
    console.log("Executed by: `" + msg.author.tag + "`");
    console.log("\n")

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
        nowCommand(msg)
    } else if (primaryCommand == "image") {
        imageCommand(arguments, msg)
    } else if (primaryCommand == "embed") {
        embedCommand(arguments, msg)
    } else if (primaryCommand == "flushed") {
        flushedCommand(arguments, msg)
    } else if (primaryCommand == undefined) {
        undefinedCommand(arguments, msg)
    } else {
        checkBadWords(arguments, msg)
    }
}

function helpCommand(arguments, msg) {
    if (arguments == 'list') {
        msg.channel.send("As of now, I can help you with these topics: `multiply`, `add`, `say`, `answer`, `now`, `image`, `embed` and `prefix`. Still improving!");
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
    } else if (arguments == 'image'){
        const attachment = new Discord.Attachment("./images/imagehelp.png");
        msg.channel.send(attachment).then().catch(console.error);
    } else if (arguments == 'embed'){
        msg.channel.send('Do you want to make some cool embeds? Try asking *me* ```embed [url] `[title]` [description]```');
    } else if (arguments == 'prefix') {
        msg.channel.send("Just call me by my name!");
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
    var checkPings = sayMessage.toString();
    var finalMessage = checkPings.replace("@everyone", "everyone").replace("@here", "here");
    msg.delete().catch(O_o=>{});
    msg.channel.send(finalMessage);

}

function answerCommand(arguments, msg) {
    var options = ["Yes", "No", "Yeah", "Nah", "Maybe", "Maybe not", "I guess", "I guess not", "I don't know, so I can't actually answer.", "I'm not sure.", "Ask someone else.", "Negative", "Negative multiplied by negative.", "Pancakes", "*Impossible*", "I don't know, but you do.", "Do you really want me to answer that?", "Uhhh"]
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
}

function nowCommand(msg) {
    var options = ["I'm feeling happy. What about you?", "I'm craving some food.", "It's a beatiful day outside, don't you think so? Flowers are singing, birds are blooming. *Wait, I screwed it up.*", "I'm just having an existential crisis: Does the Lighting McQueen have life insurance or car insurance?", "I'm eating some popcorns.", "I'm planning a way to defeat all those zombies around my Minecraft house.", "I'm *doing homework* but I should be doing homework.", "Have you ever played a videogame world cup and ranked first place? Neither me, but I'm making some coffee.", "I'm having a déjà vu.", "I was reading a book, called 'sʞooq pɐǝɹ oʇ ʍoH', I didn't understand a single word.", "Yesterday, I was back in the mine, got my pickaxe swinging from side to side, hoping to find some diamonds. When I thought I was safe, I overheard some hissing from right behind. Aw man.", "Hate me or love me, I tried playing Fortnite. Apparently I have to download it.", "I saw some memes today.", "I'm bored.", "I'm having a headache.", "I'm online.", "I feel confused, is a *taco* the same thing as a *sope* or an *enchilada*? I mean after all these are *tortillas* with stuff like meat or cheese.", "I'm kinda sad. My ice cream melted before I even tasted it.", "I want to know why roses are red and violets are blue.", "Is life made of 5 protons or why is it so Boron?", "I'm glad to have someone talking to me.", "I heard the convenience store is selling [愛] love. Can you lend me 298 yen?"];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
}

function imageCommand(arguments, msg) {
    if (arguments.length < 1) {
      msg.channel.send("I need at least one keyword to search.")
      return;
    }
    var search = arguments.join(" ");
    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + search,
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    };
    request(options, function(error, response, responseBody) {
        if (error) {
            return;
        }

        $ = cheerio.load(responseBody);

        var links = $(".image a.link");

        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));

        if (!urls.length) {
            msg.channel.send("There aren't any results.")
            return;
        }

        var priorityNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 10];

        var selectNumbers = priorityNumbers[Math.floor(Math.random()*priorityNumbers.length)];

        var imageToSend = urls[selectNumbers];

        const attachment = new Discord.Attachment(imageToSend);

        msg.channel.send(attachment).then().catch(console.error);
        console.log("Sent image: " + imageToSend);
    });
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


function flushedCommand(arguments, msg) {
  var options = [":flushed:", "<:clownflushed:630142296293376060>", "<:coolflushed:638924603107967007>", "<:cowboyflushed:638925102238400512>", "<:eggflushed:638924893907451946>"];
  var response = options[Math.floor(Math.random()*options.length)];
  msg.channel.send(response).then().catch(console.error);
}

function undefinedCommand(arguments, msg) {
  var options = ["I don't get it.", "What do you mean?", "Baka.", "Oh.", "Nani", "Nande"];
  var response = options[Math.floor(Math.random()*options.length)];
  msg.channel.send(response).then().catch(console.error);
  return
}

function checkBadWords(arguments, msg) {
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

function talkAbility(msg) {
  msg.channel.startTyping();
  sleep(500);
  var spookyDM = msg.content.toLowerCase();
  if (spookyDM.includes("hi") || spookyDM.includes("hello") || spookyDM.includes("hey") || spookyDM.includes("goodmorning") || spookyDM.includes("good morning") || spookyDM.includes("gm")) {
    var options = ["Hello", "Hi", "Hey!", ":flushed:", "<:clownflushed:630142296293376060>", "ola bb"];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
  }
  else if (spookyDM.includes("bye") || spookyDM.includes("goodbye") || spookyDM.includes("sayonara") || spookyDM.includes("goodnight") || spookyDM.includes("good night") || spookyDM.includes("gn")) {
    var options = ["See you later!", "Sayonara", "Goodbye", "Oh, bye."];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
  }
  else if (spookyDM.includes('ola bb')) {
    var options = ["ola bb", "ola", "k pasa bb", "ontas¿"];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
  }
  else if (spookyDM.includes("how are you") || spookyDM.includes("how you doin")) {
    var options = ["I'm doing well.", "I'm platinum mad.", "Who cares?", "I'm dizzy.", "I'm hungry.", "sPoOoOoOoOoOoOoKy", "Online.", "I'd say I'm up and running but I prefer riding a bicycle.", "I'm <:clownflushed:630142296293376060>. Is that even a valid response?", "I'm feeling happy. What about you?", "I'm craving some food.", "I'm just having an existential crisis: Does the Lighting McQueen have life insurance or car insurance?", "I'm eating some popcorns.", "I'm planning a way to defeat all those zombies around my Minecraft house.", "I'm *doing homework* but I should be doing homework.", "Have you ever played a videogame world cup and ranked first place? Neither me, but I'm making some coffee.", "I'm having a déjà vu.", "I'm really confused. You see, I was reading a book, called 'sʞooq pɐǝɹ oʇ ʍoH', I didn't understand a single word.", "I'm bored.", "I'm having a headache.", "I'm online.", "I feel kinda confused, is a *taco* the same thing as a *sope* or an *enchilada*? I mean after all these are *tortillas* with stuff like meat or cheese.", "I'm kinda sad. My ice cream melted before I even tasted it.", "I want to know why roses are red and violets are blue.", "I'm glad to have someone talking to me.", "I heard the convenience store is selling [愛] love. Can you lend me 298 yen?"];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
  }
  else if (spookyDM.includes("i'm happy") || spookyDM.includes("i'm fine")) {
    var options = ["That's great.", "wowie", "Good to hear that.", ":D"];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
  }
  else {
    undefinedCommand(arguments, msg)
  }
  msg.channel.stopTyping();
}

function rootCommands(msg) {
  if (msg.author.id !== "265257341967007758") {
    var options = ["Ara ara! Only David-senpai is allowed to access my root commands", "N-nani? Stop it, my senpai. What are you doing?", "Nani? Nani? Nani? What's going on? Why is my senpai calling me out, using my root commands prefix and trying to peek at them?"];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
    return
  }
  else if (msg.author.id == "265257341967007758") {
    var fullCommand = msg.content.substr(4) // Remove Ougi's rootcaller name
    var splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    var primaryCommand = splitCommand[1] // The first word directly after Ougi's name is the command
    var arguments = splitCommand.slice(2) // All other words are arguments/parameters/options for the command

    var event = new Date();
    console.log("__**" + event.toLocaleTimeString('en-US') + "**__");
    console.log(":warning: [ROOT] Command received: " + primaryCommand);
    console.log("Arguments: " + arguments);
    console.log("Executed by: `" + msg.author.tag + "`");
    console.log("\n")

    if (primaryCommand == "help") {
        helpRootCommand(arguments, msg)
    } else if (primaryCommand == "do") {
        doRootCommand(arguments, msg)
    } else if (primaryCommand == "status") {
        statusRootCommand(arguments, msg)
    } else if (primaryCommand == "log") {
        logRootCommand(arguments, msg)
    }
    else {
        undefinedCommand(arguments, msg)
    }
  }
}

// -------------- ROOT COMMANDS BELOW -------------- //

function helpRootCommand(arguments, msg) {
  msg.channel.send("Current root commands: `help`, `do`, `status` and `log`.").then().catch(console.error);
}

function doRootCommand(arguments, msg) {
  var newArgs = arguments.join(" ").toString();
  var newArguments = newArgs.split('"');
  var name = newArguments[1];
  var type = newArguments[2];
  client.user.setActivity(name, { type: type.replace(" ","") })
  console.log("I'm " + type.replace(" ","") + " " + name)
  msg.channel.send("Alright, switched! I'm " + type.replace(" ","") + " " + name).then().catch(console.error);
}

function statusRootCommand(arguments, msg) {
  var status = arguments[0];
  client.user.setStatus(status).then().catch(console.error);
  console.log("Now I'm " + status.replace("dnd", "in Do Not Disturb mode"));
  msg.channel.send("Now I'm " + status.replace("dnd", "in Do Not Disturb mode"));
}

function logRootCommand(arguments, msg) {
  var what = arguments[0];
  if (what == "emoji") {
    const emojiList = client.emojis.map((e, x) => (x + ' = ' + e) + ' | ' +e.name).join('\n')
    fs.writeFile('all.emoji', emojiList, console.error);
    msg.channel.send("I've wrote a file called all.emoji containing every single emoji I can use");
  }
  else if (what == "guilds") {
    const guildsList = client.guilds.map((e, x) => (x + ' = ' + e)).join('\n')
    fs.writeFile('all.guilds', guildsList, console.error);
    msg.channel.send("I've wrote a file called all.guilds containing every single guild I'm in");
  }
}

// -------------- ROOT COMMANDS ABOVE -------------- //

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

client.login(process.env.TOKEN);
