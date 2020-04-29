require('dotenv').config();
var lastTweet = require('last-tweet')
var Discord = require('discord.js');
var client = new Discord.Client();
var fs = require('fs');
let wordsChannel = "704954561294761984";
client.login(process.env.TOKEN);
async function asyncTweet(){
  var getTweet = await lastTweet('OugiBotto'); //Get the spookiest rarity's latest tweet
  console.log(getTweet)
  var spookySchedule = getTweet.time
  if (spookySchedule.endsWith('min') || spookySchedule.endsWith('s')) {
    return
  }
  if (spookySchedule.endsWith('h')) {
    var spookyTime = 12;
    var inHours = spookySchedule.replace(' h', '') * 1;
    if (inHours <= spookyTime) {
      console.log("won't tweet")
      return
    }
  }
  var iSaid = client.channels.get(wordsChannel).fetchMessages({ limit: 1 }).then(messages => {
    var store = messages.first();
    var willSay = store * 1;
    console.log(willSay)
    var pseudoEnglish = JSON.parse(fs.readFileSync('./spookyWords', 'utf-8', console.error));
    var options = ["it spooky", "it bad at fortnite", "it has me", "i want more of it", "it better than ninja", "it good", "help", "quieres¿", "it be menacing", "it be sad", "say sike", "it an all-star", "it a rockstar", "it no stranger to love", "it knows the rules and so do i", "it didn't make sense not to live for fun", "it brain got smart but it head got dumb", "it much to do, so much to see", "it spooky", "it wrong to take the backstreets", "it never knows if it does not go", "it never shines but it glows", "heee heee", "ayuwoki", "it ok", "it comes alive in midnight", "it can make a promise", "it can make a change", "it can make the difference", "it needs friends", "it tall", "it smol", "it says u bad at fortnite", "i achieved comedy"];
    var response = options[Math.floor(Math.random()*options.length)];
    var contentToSay = "i have " + pseudoEnglish[willSay] + "\n" + response;
    console.log(contentToSay)
    store.channel.send(willSay + 1)
  });
}
client.on('ready', () => {
asyncTweet().catch(console.error)
return
});
