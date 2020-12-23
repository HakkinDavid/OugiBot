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
global.translate = require('@k3rn31p4nic/google-translate-api');
global.randomCase = require('random-case');
global.findRemoveSync = require('find-remove');
global.stringSimilarity = require('string-similarity');
global.levenary = require('levenary');
global.leven = require('leven');
global.isHexcolor = require('is-hexcolor');
global.isImageUrl = require('is-image-url');
global.ytdl = require('ytdl-core');
global.scrapeYt = require("scrape-yt");
global.KSoftMain = require ('@ksoft/api');
global.ksoft = new KSoftMain.KSoftClient(process.env.KSOFTTOKEN);
global.removeWords =  require('remove-words');

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
global.wordsChannel = "726928050310217760";
global.fileSpace = "726929586339840072";
global.remindersChannel = "726929651573981225";
global.embedsChannel = "740187317238497340";
global.newsChannel = "751697345737129994";
global.neuroChannel = "759983614128947250";
global.settingsChannel = "791151086077083688";

/* Rogumonogatari */
global.consoleLogging = "726927838724489226";
global.fetchedChannels = [settingsChannel, backupChannel, embedsChannel, newsChannel, neuroChannel];
global.errorBackup = console.error;
global.logMessages = [];

console.error = function() {
    logMessages.push.apply(logMessages, arguments);
    if (logMessages[0] == "\n" || logMessages[0] == null || logMessages[0] == undefined){
      logMessages.pop();
    }
    else {
      let criticalEmbed = new Discord.MessageEmbed()
      .setAuthor("CONSOLE ERROR")
      .setColor("#c20d00")
      .setFooter("errorLogEmbed by Ougi", client.user.avatarURL())
      .setTimestamp()
      .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/fatal.png?raw=true")
      .setDescription(logMessages.pop().toString());

      client.channels.cache.get(consoleLogging).send(criticalEmbed).catch(console.error);
    }
    errorBackup.apply(console, arguments);
};

/* Chuuimonogatari */
client.on('ready', () => {
  if (process.env.DEV) {
    findRemoveSync('./vc/', {extensions: ['.txt']});
    findRemoveSync('./ammo/', {extensions: ['.txt']});
  }
  else {
    findRemoveSync('./', {extensions: ['.txt']});
  }
  for (i=0; i < fetchedChannels.length; i++) {
    ougi.fetch(fetchedChannels[i]);
  }

  fs.writeFileSync('./aimAssist.txt', "[]", console.error);

  ougi.startup();
});

client.on('message', (msg) => {
    if (msg.author == client.user) {
      return
    }

    if (msg.author.bot) {
      return
    }

    if (!fs.existsSync('./responses.txt') || !fs.existsSync('./settings.txt') || !fs.existsSync('./neuroNetworks.txt')) {
      return
    }

    let settings = JSON.parse(fs.readFileSync('./settings.txt'));

    if (settings.ignored.includes(msg.author.id)) {
      if (msg.content == "I want to start using Ougi [BOT].") {
        ougi.optback(msg);
      }
      return
    }

    if (msg.content.toLowerCase().startsWith("ougi") || msg.content.startsWith("扇") || msg.content.startsWith("<@629837958123356172>") || msg.content.startsWith("<@!629837958123356172>")) {
      ougi.processCommand(msg);
    }

    else if (msg.content.toLowerCase().startsWith("#ougi")) {
      ougi.rootCommands(msg);
    }

    else if (msg.channel.type == "text" && msg.content.length > 0) {
      let guildID = msg.guild.id;
      if (settings.prefix.hasOwnProperty(guildID)){
        let aPrefix = settings.prefix[guildID];
        if (msg.content.toLowerCase().startsWith(aPrefix)) {
          if (msg.content.length == aPrefix.length) {
            msg.content = 'ougi';
          }
          else {
            msg.content = msg.content.substring(aPrefix.length);
            msg.content = 'ougi ' + msg.content;
          }

          ougi.processCommand(msg);
        }
      }
    }

    else if (msg.content == "I want to opt out from using Ougi [BOT]." && msg.channel.type == "dm") {
      let pseudoMSG = msg;
      pseudoMSG.content = "ougi OPTOUTSTATEMENT";
      ougi.globalLog(pseudoMSG);
      ougi.optout(msg);
    }

    else if (msg.channel.type == "dm" && msg.content.length > 0) {
      ougi.judgementAbility(msg);
    }
})

client.on('messageDelete', (msg) => {
    if (msg.author == client.user) {
      return
    }
    if (msg.content.toLowerCase().startsWith("ougi") || msg.author.bot || msg.content.startsWith("扇") || msg.content.toLowerCase().startsWith("#ougi") || msg.content.startsWith("<@629837958123356172>") || msg.content.startsWith("<@!629837958123356172>")) {
      return
    }
    if (!fs.existsSync('./settings.txt')) {
      return
    }
    let settings = JSON.parse(fs.readFileSync('./settings.txt'));
    if (settings.ignored.includes(msg.author.id)) {
      return
    }
    if (msg.channel.type == "text") {
      let guildID = msg.guild.id;
      if (settings.blacklist.hasOwnProperty(guildID)){
        let existent = settings.blacklist[guildID];
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

/*Makotomonogatari*/
client.setInterval(
  function () {
    if (process.env.DEV) {
      findRemoveSync('./', {extensions: ['.txt']});
      for (i=0; i < fetchedChannels.length; i++) {
        ougi.fetch(fetchedChannels[i]);
      }

      fs.writeFileSync('./aimAssist.txt', "[]", console.error);

      ougi.startup();
    }
    else {
      client.destroy();
      process.exit();
    }
  }, 28800000);

/* Kaishimonogatari */
client.login(process.env.TOKEN);
