/* Shokkamonogatari */
require('dotenv').config();
global.Discord = require('discord.js');
global.client = new Discord.Client();
global.fs = require('fs');
global.cheerio = require('cheerio');
global.request = require('request');
global.requireAll = require('require-all');

/* Kansuumonogatari */

global.ougi = require('require-all')(__dirname + '/function');

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
  var options = ["hi", "ohayou", "baka", "hey there!", "ola bb", "Ougi joins the battle!", "Creeper. \nAw man"];
  var response = options[Math.floor(Math.random()*options.length)];
  var doing = ["Minecraft", "Fortnite", "Destiny 2", "Portal", "Portal 2", "Project 64", "osu!", "Geometry Dash", "Slime Rancher", "Left 4 Dead 2", "Transformice", "Grand Theft Auto V", "Team Fortress 2", "Overwatch", "Undertale", "Dolphin", "Ultimate Custom Night", "Minecraft Windows 10 Edition", "Terraria", "Roblox", "Paladins", "Tom Clancy's Rainbow Six Siege"]
  var something = doing[Math.floor(Math.random()*doing.length)];
  client.user.setActivity(something)
  console.log(response + "\nI'm playing " + something);
  console.log("\n");
});

client.on('message', (msg) => {
    if (msg.author == client.user) { // Prevent bot from responding to its own messages
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
