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

async function asyncTweet(){
  var getTweet = await lastTweet('OugiBotto'); //Get the spookiest rarity's latest tweet
  var spookySchedule = getTweet.time
  if (spookySchedule.endsWith('min') || spookySchedule.endsWith('s')) {
    return
  }
  else if (spookySchedule.endsWith('h')) {
    var spookyTime = 6;
    var inHours = spookySchedule.replace(' h', '') * 1;
  }
  if (inHours <= spookyTime) {
    return
  }
  else if (inHours >= spookyTime) {
    var iSaid = client.channels.get(wordsChannel).fetchMessages({ limit: 1 }).then(messages => {
      var store = messages.first();
      var willSay = store * 1;
      console.log("Going to tweet word number: " + willSay)
      var pseudoEnglish = JSON.parse(fs.readFileSync('./spookyWords', 'utf-8', console.error));
      var options = ["it spooky", "it bad at fortnite", "it has me", "i want more of it", "it better than ninja", "it good", "help", "quieres¿", "it be menacing", "it be sad", "say sike", "it an all-star", "it a rockstar", "it no stranger to love", "it knows the rules and so do i", "it didn't make sense not to live for fun", "it brain got smart but it head got dumb", "it much to do, so much to see", "it spooky", "it wrong to take the backstreets", "it never knows if it does not go", "it never shines but it glows", "heee heee", "ayuwoki", "it ok", "it comes alive in midnight", "it can make a promise", "it can make a change", "it can make the difference", "it needs friends", "it tall", "it smol", "it says u bad at fortnite", "i achieved comedy"];
      var response = options[Math.floor(Math.random()*options.length)];
      var contentToSay = "i have " + pseudoEnglish[willSay] + "\n" + response;
      T.post('statuses/update', { status: contentToSay }, function(err, data, response) {
        console.log("Tweeted: " + contentToSay)
      })
      store.channel.send(willSay + 1)
    });

  }
}

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
  asyncTweet().catch(console.error);
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
