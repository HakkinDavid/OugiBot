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
global.findRemoveSync = require('find-remove');

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
global.backupChannel = "726927738094485534";
global.guildLoggerChannel = "726929433398738954";
global.wordsChannel = "726928050310217760";
global.fileSpace = "726929586339840072";
global.remindersChannel = "726929651573981225";
global.blacklistChannel = "731423847194296410";

/* Rogumonogatari */
global.consoleLogging = "726927838724489226";
global.logBackup = console.log;
global.logMessages = [];

console.log = function() {
    logMessages.push.apply(logMessages, arguments);
    if (logMessages[0] == "\n"){
      logMessages.pop();
    }
    else {
      client.channels.get(consoleLogging).send(logMessages.pop()).then().catch(console.error);
    }
    logBackup.apply(console, arguments);
};

/* Chuuimonogatari */
client.on('ready', () => {
  var cleanCache = findRemoveSync('./', {extensions: ['.txt']});
  var whereToFetch = client.channels.get(backupChannel).fetchMessages({ limit: 1 }).then(messages => { var lastMessage = messages.first(); download(lastMessage.attachments.first().url); });
  var whereToFetchLogs = client.channels.get(guildLoggerChannel).fetchMessages({ limit: 1 }).then(messages => { var lastMessage = messages.first(); download(lastMessage.attachments.first().url); });
  var whereToFetchBlacklist = client.channels.get(blacklistChannel).fetchMessages({ limit: 1 }).then(messages => { var lastMessage = messages.first(); download(lastMessage.attachments.first().url); });

  fs.writeFileSync('./aimAssist.txt', "[]", console.error);

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

    if (msg.author.bot) {
      return
    }

    if (msg.content.toLowerCase().startsWith("ougi") || msg.content.startsWith("扇") || msg.content.startsWith("<@629837958123356172>") || msg.content.startsWith("<@!629837958123356172>")) {
        ougi.processCommand(msg);
    }

    else if (msg.content.toLowerCase().startsWith("#ougi")) {
        ougi.rootCommands(msg);
    }

    else if (msg.channel.type == "dm") {
        var event = new Date();
        var spookyLog = "__**" + event.toLocaleTimeString('en-US') + "**__\nDM received: " + msg.content + "\nSent by: `" + msg.author.tag + "` with ID: `" + msg.author.id + "`";
        console.log(spookyLog.replace("@everyone", "@.everyone").replace("@here", "@.here"));
        ougi.talkAbility(msg);
    }
})

client.on('messageDelete', (msg) => {
    if (msg.author == client.user) {
        return
    }
    if (msg.content.toLowerCase().startsWith("ougi") || msg.author.bot || msg.content.startsWith("扇") || msg.content.toLowerCase().startsWith("#ougi") || msg.content.startsWith("<@629837958123356172>") || msg.content.startsWith("<@!629837958123356172>")) {
        return
    }
    if (msg.channel.type == "text") {
      var guildID = msg.guild.id;
      var unsniper = JSON.parse(fs.readFileSync('./blacklist.txt', 'utf-8', console.error));
      if (unsniper.hasOwnProperty(guildID)){
        var existent = unsniper[guildID];
        for(var i = 0; i < existent.length; i++) {
          if(existent[i].toLowerCase() === "snipe") {
            return
          }
        }
      }
    }
    ougi.loadSniper(msg);
});

client.on("channelDelete", (channel) => {
    ougi.autoRMChannel(channel)
});

/* Kaishimonogatari */
client.login(process.env.TOKEN);
