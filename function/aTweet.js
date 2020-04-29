module.exports =
function aTweet(){
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
