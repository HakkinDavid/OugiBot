/* Shokkamonogatari */
require('dotenv').config();
global.Discord = require('discord.js');
global.client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.AutoModerationConfiguration,
    Discord.GatewayIntentBits.AutoModerationExecution,
    Discord.GatewayIntentBits.DirectMessageReactions,
    Discord.GatewayIntentBits.DirectMessageTyping,
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.GuildBans,
    Discord.GatewayIntentBits.GuildEmojisAndStickers,
    Discord.GatewayIntentBits.GuildIntegrations,
    Discord.GatewayIntentBits.GuildInvites,
    Discord.GatewayIntentBits.GuildMessageReactions,
    Discord.GatewayIntentBits.GuildMessageTyping,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildModeration,
    Discord.GatewayIntentBits.GuildScheduledEvents,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.GuildWebhooks,
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.MessageContent
  ],
  'partials': [
    Discord.Partials.User, Discord.Partials.Channel, Discord.Partials.GuildMember, Discord.Partials.Message, Discord.Partials.Reaction, Discord.Partials.GuildScheduledEvent, Discord.Partials.ThreadMember
  ]
});
global.fs = require('fs');
global.request = require('request');
global.requireAll = require('require-all');
global.download = require('download-file');
global.Twit = require('twit');
global.translate = require('@vitalets/google-translate-api');
global.randomCase = require('random-case');
global.findRemoveSync = require('find-remove');
global.stringSimilarity = require('string-similarity');
global.levenary = require('levenary');
global.leven = require('leven');
global.isHexcolor = require('is-hexcolor');
global.isImageUrl = require('is-image-url');
global.ytdl = require('ytdl-core-discord');
global.scrapeYt = require("scrape-yt");
global.KSoftMain = require ('@ksoft/api');
global.ksoft = new KSoftMain.KSoftClient(process.env.KSOFTTOKEN);
global.removeWords =  require('remove-words');
global.NewsAPI = require('newsapi');
global.newsapi = new NewsAPI(process.env.NEWS);
global.gis = require('async-g-i-s');
global.CryptoJS = require("crypto-js");
global.Voice = require('@discordjs/voice');
global.Nodepath = require('node:path');
global.colors = require('@colors/colors/safe');

global.instanceID = Date.now().toString().slice(-4);
if (process.argv.slice(2) == "silent") {
  global.TEASEABLE = false;
}
else {
  global.TEASEABLE = true;
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
global.davidUserID = "265257341967007758";
global.backupChannel = "726927738094485534";
global.fileSpace = "726929586339840072";
global.remindersChannel = "726929651573981225";
global.embedsChannel = "740187317238497340";
global.newsChannel = "751697345737129994";
global.neuroChannel = "759983614128947250";
global.settingsChannel = "791151086077083688";
global.localesChannel = "820971831992647681";
global.dynamicLocalesChannel = "880322518139957299";
global.ammo = {};
global.reloadedAmmo = {};
global.vc = {};

global.settingsOBJ = null;
global.mindOBJ = null;
global.localesCache = null;
global.dynamicLocales = null;
global.knowledgeBase = null;

/* Rogumonogatari */
global.consoleLogging = "1140457399673688176";
global.database = {
  'settings': {id: settingsChannel, file: './settings.txt', done: false},
  'backup': {id: backupChannel, file: './responses.txt', done: false},
  'embeds': {id: embedsChannel, file: './embedPresets.txt', done: false},
  'news': {id: newsChannel, file: './newsChannel.txt', done: false},
  // 'neuro': {id: neuroChannel, file: './neuroNetworks.txt', done: false},
  'locales': {id: localesChannel, file: './localesCache.txt', done: false},
  'dynamicLocales': {id: dynamicLocalesChannel, file: './dynamicLocales.txt', done: false}
};
global.errorBackup = console.error;
global.logMessages = [];

console.error = function() {
    logMessages.push.apply(logMessages, arguments);
    if (logMessages[logMessages.length-1] == "\n" || logMessages[logMessages.length-1] == null || logMessages[logMessages.length-1] == undefined){
      logMessages.pop();
      return
    }
      let criticalEmbed = new Discord.EmbedBuilder()
      .setAuthor({name: "CONSOLE ERROR"})
      .setColor("#c20d00")
      .setFooter({text: "errorLogEmbed by Ougi", icon: "https://github.com/HakkinDavid/OugiBot/blob/master/images/ougi.png?raw=true"})
      .setTimestamp()
      .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/fatal.png?raw=true")
      .setDescription(logMessages.pop().toString());

     errorBackup.apply(console, arguments);
    client.channels.cache.get(consoleLogging).send({embeds: [criticalEmbed]}).catch(console.error);
};

ougi.syncData = async function () {
  for (data_obj_name in database) {
    if (database[data_obj_name].done === false) await ougi.fetch(database[data_obj_name].id, database[data_obj_name].file, data_obj_name);
  };
}

setInterval(ougi.syncData, 30000);

/* Chuuimonogatari */
client.on('ready', async () => {
  findRemoveSync('./', {extensions: ['.txt', '.mp3']});
  await ougi.syncData();

  client.channels.cache.get(consoleLogging).send("**INSTANCE ID:** " + instanceID + "\n**DEV:** " + process.env.DEV + "\n**SILENT MODE:** " + !global.TEASEABLE).catch(console.error);
  console.log("Instance ID: " + instanceID);

  if (global.TEASEABLE) {
    await ougi.startup();
  }

});

client.on('messageCreate', async (msg) => {
    if (msg.author === null) {
      console.log("Unable to retrieve user object in messageCreate event.");
      return
    }
    if (msg.author == client.user) {
      return
    }

    if (msg.author && msg.author.bot) {
      if (msg.channel.type === Discord.ChannelType.GuildText && msg.author.id === '302050872383242240' && settingsOBJ.guildBump.hasOwnProperty(msg.guild.id)) {
        if (msg.embeds[0].data.description.includes("Bump done")) {
          settingsOBJ.guildBump[msg.guild.id].next_bump = msg.createdTimestamp + 1000 * 60 * 60 * 2;
          settingsOBJ.guildBump[msg.guild.id].reminded = false;
          ougi.globalLog("Bump for " + msg.guild.toString() + " detected at " + msg.createdTimestamp + ". Next bump should occur no sooner than " + settingsOBJ.guildBump[msg.guild.id].next_bump + ".");
        }
      }
      return
    }

    if (!global.TEASEABLE) {
      if (msg.author.id != "265257341967007758") {
        return
      }
      else {
        if (!msg.content.startsWith(instanceID + "::")) {
          return
        }
        msg.content = msg.content.replace(instanceID + "::", "");
      }
    }

    if (settingsOBJ === null || /* mindOBJ === null || */ localesCache === null || dynamicLocales === null || knowledgeBase === null) {
      if (!fs.existsSync(database.settings.file) || /* !fs.existsSync(database.neuro.file) || */ !fs.existsSync(database.locales.file) || !fs.existsSync(database.dynamicLocales.file) || !fs.existsSync(database.backup.file)) {
        return
      }
      global.settingsOBJ = ougi.readFile(database.settings.file);
      // global.mindOBJ = ougi.readFile(database.neuro.file);
      global.localesCache = ougi.readFile(database.locales.file);
      global.dynamicLocales = ougi.readFile(database.dynamicLocales.file);
      global.knowledgeBase = ougi.readFile(database.backup.file, 'utf-8');

      if (!settingsOBJ.hasOwnProperty("guildBump")) {
        console.log(colors.yellow("Settings OBJ guildBump property created."));
        settingsOBJ.guildBump = {};
      }
    }

    if (settingsOBJ.ignored.includes(msg.author.id)) {
      if (msg.content == "I want to start using Ougi [BOT].") {
        ougi.optback(msg);
      }
      return
    }

    let replied_to_ougi = false;
    
    try {
      if (msg.reference !== null) replied_to_ougi = (await msg.channel.messages.fetch(msg.reference.messageId)).author.id === client.user.id;
    }
    catch (e) {
      console.log(e);
    }

    if (msg.content.toLowerCase().startsWith("ougi") || msg.content.startsWith("扇") || msg.content.startsWith("<@629837958123356172>") || msg.content.startsWith("<@!629837958123356172>")) {
      ougi.processCommand(msg);
    }

    else if (msg.content.toLowerCase().startsWith("#ougi")) {
      ougi.rootCommands(msg);
    }

    else if (msg.channel.type === Discord.ChannelType.GuildText && msg.content.length > 0) {
      let guildID = msg.guild.id;
      let regularMessage = true;
      if (settingsOBJ.prefix.hasOwnProperty(guildID)){
        let aPrefix = settingsOBJ.prefix[guildID];
        if (msg.content.toLowerCase().startsWith(aPrefix)) {
          if (msg.content.length === aPrefix.length) {
            msg.content = 'ougi';
          }
          else {
            msg.content = msg.content.substring(aPrefix.length);
            msg.content = 'ougi ' + msg.content;
          }

          ougi.processCommand(msg);
          regularMessage = false;
        }
      }

      if (replied_to_ougi && regularMessage) {
        ougi.judgementAbility(msg, replied_to_ougi);
      }

      if (regularMessage && settingsOBJ.economy.hasOwnProperty(guildID) && !settingsOBJ.economy[guildID].disabled && (settingsOBJ.economy[guildID].channels.length === 0 || settingsOBJ.economy[guildID].channels.includes(msg.channel.id))) {
        ougi.economy('xp', msg);
      }
    }

    else if (msg.content === "I want to opt out from using Ougi [BOT]." && msg.channel.type === Discord.ChannelType.DM) {
      let pseudoMSG = msg;
      pseudoMSG.content = "ougi OPTOUTSTATEMENT";
      ougi.globalLog(pseudoMSG);
      ougi.optout(msg);
    }

    else if (msg.channel.type === Discord.ChannelType.DM && msg.content.length > 0) {
      ougi.judgementAbility(msg);
    }
})

client.on('messageDelete', async (msg) => {
    if (msg.author === null) {
      console.log("Unable to retrieve user object in messageDelete event.");
      return
    }
    if (!global.TEASEABLE) {
      return
    }
    if (msg.author == client.user) {
      return
    }
    if (msg.author && msg.author.bot || msg.content && (msg.content.toLowerCase().startsWith("ougi") || msg.content.startsWith("扇") || msg.content.toLowerCase().startsWith("#ougi") || msg.content.startsWith("<@629837958123356172>") || msg.content.startsWith("<@!629837958123356172>"))) {
      return
    }
    if (settingsOBJ === null || /* mindOBJ === null || */ localesCache === null || dynamicLocales === null || knowledgeBase === null) {
      if (!fs.existsSync(database.settings.file) || /* !fs.existsSync(database.neuro.file) || */ !fs.existsSync(database.locales.file) || !fs.existsSync(database.dynamicLocales.file) || !fs.existsSync(database.backup.file)) {
        return;
      }
      global.settingsOBJ = ougi.readFile(database.settings.file);
      // global.mindOBJ = ougi.readFile(database.neuro.file);
      global.localesCache = ougi.readFile(database.locales.file);
      global.dynamicLocales = ougi.readFile(database.dynamicLocales.file);
      global.knowledgeBase = ougi.readFile(database.backup.file, 'utf-8');
    }
    if (settingsOBJ.ignored.includes(msg.author.id)) {
      return
    }
    if (msg.channel.type == Discord.ChannelType.GuildText) {
      let guildID = msg.guild.id;
      if (settingsOBJ.blacklist.hasOwnProperty(guildID)){
        let existent = settingsOBJ.blacklist[guildID];
        for (var i = 0; i < existent.length; i++) {
          if (existent[i].toLowerCase() === "snipe") {
            return
          }
        }
      }
    }
    ougi.loadSniper(msg, false);
});

client.on('messageUpdate', (msg) => {
    if (msg.author === null) {
      console.log("Unable to retrieve user object in messageUpdate event.");
      return
    }
    if (!global.TEASEABLE) {
      return
    }
    if (msg.author == client.user) {
      return
    }
    if (msg.author && msg.author.bot || msg.content && (msg.content.toLowerCase().startsWith("ougi") || msg.content.startsWith("扇") || msg.content.toLowerCase().startsWith("#ougi") || msg.content.startsWith("<@629837958123356172>") || msg.content.startsWith("<@!629837958123356172>"))) {
      return
    }
    if (settingsOBJ === null || /* mindOBJ === null || */ localesCache === null || dynamicLocales === null || knowledgeBase === null) {
      if (!fs.existsSync(database.settings.file) || /* !fs.existsSync(database.neuro.file) || */ !fs.existsSync(database.locales.file) || !fs.existsSync(database.dynamicLocales.file) || !fs.existsSync(database.backup.file)) {
        return
      }
      global.settingsOBJ = ougi.readFile(database.settings.file);
      // global.mindOBJ = ougi.readFile(database.neuro.file);
      global.localesCache = ougi.readFile(database.locales.file);
      global.dynamicLocales = ougi.readFile(database.dynamicLocales.file);
      global.knowledgeBase = ougi.readFile(database.backup.file, 'utf-8');
    }
    if (settingsOBJ.ignored.includes(msg.author.id)) {
      return
    }
    if (msg.channel.type == Discord.ChannelType.GuildText) {
      let guildID = msg.guild.id;
      if (settingsOBJ.blacklist.hasOwnProperty(guildID)){
        let existent = settingsOBJ.blacklist[guildID];
        for (var i = 0; i < existent.length; i++) {
          if (existent[i].toLowerCase() === "editsnipe") {
            return
          }
        }
      }
    }
    ougi.loadSniper(msg, true);
});

setInterval(
  async function () {
    if (!global.TEASEABLE) {
      return
    }
    global.ammo = {};
    global.reloadedAmmo = {};
    await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
    await ougi.backup(database.settings.file, settingsChannel);
  },
  300000
);

setInterval(
  async function () {
    if (!global.TEASEABLE) {
      return
    }
    let ctime = Date.now();
    for (guildID in settingsOBJ.guildBump) {
      if (settingsOBJ.guildBump[guildID].next_bump && settingsOBJ.guildBump[guildID].next_bump < ctime && !settingsOBJ.guildBump[guildID].reminded) {
        ougi.globalLog("Reminded users to bump guild with ID " + guildID + " as bump became available at " + settingsOBJ.guildBump[guildID].next_bump);
        await client.channels.cache.get(settingsOBJ.guildBump[guildID].channel).send((await ougi.text((settingsOBJ.lang[guildID] || "en"), "bumpNow")).replace("{timeStamp}", '<t:' + Math.round(ctime/1000) + ':t>') + (settingsOBJ.guildBump[guildID].role ? "\n<@&" + settingsOBJ.guildBump[guildID].role + ">" : ""));
        settingsOBJ.guildBump[guildID].reminded = true;
      }
    }
  },
  60000
);

process.on('uncaughtException', (e) => {
    try {
      let trimmed = JSON.stringify(e, Object.getOwnPropertyNames(e), 4).replace(/\\n/g, '\n');
      while (trimmed.length > 0) {
        client.users.cache.get(davidUserID).send("```" + trimmed.slice(0,1994) + "```");
        trimmed = trimmed.slice(1994);
      }
    }
    catch {
      console.log('unable to DM david for console error');
      console.log(e);
    }
});

/* Kaishimonogatari */
client.login(process.env.TOKEN);
