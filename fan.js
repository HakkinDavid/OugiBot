/* Shokkamonogatari */
require('dotenv').config();
global.Discord = require('discord.js');
global.client = new Discord.Client();
global.fs = require('fs');
global.cheerio = require('cheerio');
global.request = require('request');
global.requireAll = require('require-all');
global.download = require('download-file');
global.Twit = require('twit');
global.lastTweet = require('last-tweet');
global.translate = require('@vitalets/google-translate-api');
global.randomCase = require('random-case');

if(process.env.OFFLINE == 1) {
  client.destroy();
  process.exit();
}

/* Tsuittamonogatari */

global.T = new Twit({
  consumer_key:         process.env.CKEY,
  consumer_secret:      process.env.CSECRET,
  access_token:         process.env.ACCTOKEN,
  access_token_secret:  process.env.ACCTOKENSECRET,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

/* Kansuumonogatari */

global.ougi = require('require-all')(__dirname + '/function');
global.backupChannel = "719639811157131375";
global.wordsChannel = "719640023544103012";
global.fileSpace = "719639409808637982";
global.remindersChannel = "719855319110647868";

/* Rogumonogatari */
global.consoleLogging = "719641437267951616";
global.logBackup = console.log;
global.logMessages = [];

console.log = function() {
    logMessages.push.apply(logMessages, arguments);
    if (logMessages[0] == "\n"){
      client.channels.get(consoleLogging).send("**<:blank:720802695908163604> **").then().catch(console.error);
      logMessages.pop();
    }
    else {
      client.channels.get(consoleLogging).send(logMessages.pop()).then().catch(console.error);
    }
    logBackup.apply(console, arguments);
};

/* Chuuimonogatari */
client.on('ready', () => {
  var whereToFetch = client.channels.get(backupChannel).fetchMessages({ limit: 1 }).then(messages => { var lastMessage = messages.first(); download(lastMessage.attachments.first().url); })

  if(process.env.DEV == 0){
    var options = ["hi", "ohayou", "baka", "hey there!", "ola bb", "Ougi joins the battle!", "Creeper. \nAw man"];
    var response = options[Math.floor(Math.random()*options.length)];
    var doing = ["Minecraft", "Fortnite", "Destiny 2", "Portal", "Portal 2", "Project 64", "osu!", "Geometry Dash", "Slime Rancher", "Left 4 Dead 2", "Transformice", "Grand Theft Auto V", "Team Fortress 2", "Overwatch", "Undertale", "Dolphin", "Ultimate Custom Night", "Minecraft Windows 10 Edition", "Terraria", "ROBLOX", "Paladins", "Tom Clancy's Rainbow Six Siege"]
    var something = doing[Math.floor(Math.random()*doing.length)];
    client.user.setActivity(something)
    var ougiStart = response + "\nI'm playing " + something;
    console.log(ougiStart);
    console.log("\n");
    ougi.aTweet();
  }
  else {
    client.user.setActivity("to update myself!");
    console.log("I'm in UPDATE/DEV MODE");
  }
});

client.on('message', (msg) => {
    if (msg.author == client.user) {
        return
    }

    if (msg.content.toLowerCase().startsWith("ougi") && !msg.author.bot) {
        ougi.processCommand(msg);
    }

    else if (msg.content.startsWith("扇") && !msg.author.bot) {
        ougi.processCommand(msg);
    }

    else if (msg.content.toLowerCase().startsWith("<@629837958123356172>") && !msg.author.bot) {
        ougi.processCommand(msg);
    }

    else if (msg.content.toLowerCase().startsWith("#ougi") && !msg.author.bot) {
        ougi.rootCommands(msg);
    }

    else if (msg.channel.type == "dm") {
        var event = new Date();
        console.log("__**" + event.toLocaleTimeString('en-US') + "**__\nDM received: " + msg.content.replace("@everyone", "{everyone}").replace("@here", "{here}") + "\nSent by: `" + msg.author.tag + "` with ID: `" + msg.author.id + "`");
        ougi.talkAbility(msg);
    }
})

/* Kaishimonogatari */
client.login(process.env.TOKEN);
