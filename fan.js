/* Shokkamonogatari */
require('dotenv').config();
global.Discord = require('discord.js');
global.client = new Discord.Client();
global.fs = require('fs');
global.cheerio = require('cheerio');
global.request = require('request');
global.requireAll = require('require-all');
global.download = require('download-file')
global.Twit = require('twit')
global.lastTweet = require('last-tweet')

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
global.backupChannel = "693733162408345670";
global.wordsChannel = "704954561294761984";

/* Rogumonogatari */
global.consoleLogging = "647348129078837254";
global.logBackup = console.log;
global.logMessages = [];

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

/* Chuuimonogatari */
client.on('ready', () => {
  var whereToFetch = client.channels.get(backupChannel).fetchMessages({ limit: 1 }).then(messages => { var lastMessage = messages.first(); download(lastMessage.attachments.first().url); })

  var options = ["hi", "ohayou", "baka", "hey there!", "ola bb", "Ougi joins the battle!", "Creeper. \nAw man"];
  var response = options[Math.floor(Math.random()*options.length)];
  var doing = ["Minecraft", "Fortnite", "Destiny 2", "Portal", "Portal 2", "Project 64", "osu!", "Geometry Dash", "Slime Rancher", "Left 4 Dead 2", "Transformice", "Grand Theft Auto V", "Team Fortress 2", "Overwatch", "Undertale", "Dolphin", "Ultimate Custom Night", "Minecraft Windows 10 Edition", "Terraria", "ROBLOX", "Paladins", "Tom Clancy's Rainbow Six Siege"]
  var something = doing[Math.floor(Math.random()*doing.length)];
  client.user.setActivity(something)
  var ougiStart = response + "\nI'm playing " + something;
  console.log(ougiStart);
  console.log("\n");
  if(process.env.DEV == 0){
    ougi.aTweet();
  }
  else {
    client.user.setActivity("to update myself!")
  }
});

client.on('message', (msg) => {
    if (msg.author == client.user) {
        return
    }

    if (msg.content.toLowerCase().startsWith("ougi") && !msg.author.bot) {
        ougi.processCommand(msg);
    }

    else if (msg.content.toLowerCase().startsWith("#ougi") && !msg.author.bot) {
        ougi.rootCommands(msg);
    }

    else if (msg.channel.type == "dm") {
        ougi.talkAbility(msg);
    }
})

/* Kaishimonogatari */
client.login(process.env.TOKEN);
