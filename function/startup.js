module.exports =

function aTweet() {
  var iSaid = client.channels.get(wordsChannel).fetchMessages({ limit: 1 }).then(messages => {
    var store = messages.first();
    var willSay = store * 1;
    var pseudoEnglish = JSON.parse(fs.readFileSync('./spookyWords', 'utf-8', console.error));
    var pick = ["have", "homies"];
    var action = pick[Math.floor(Math.random()*pick.length)];

    if (action == "have") {
      var options = ["it's spooky", "it's bad at Fortnite", "it has me", "I want more of it", "it's better than Ninja", "it's good", "help", "quieres¿", "it's menacing", "it's sad", "say sike", "it's an all-star", "it's a rockstar", "it's no stranger to love", "it knows the rules and so do I", "it didn't make sense not to live for fun", "its brain got smart but it head got dumb", "it's much to do, so much to see", "it's spooky", "it's wrong to take the backstreets", "it never knows if it does not go", "it never shines but it glows", "heee heee", "ayuwoki", "it's ok", "it comes alive in midnight", "it can make a promise", "it can make a change", "it can make the difference", "it needs friends", "it's tall", "it's small", "it says you are bad at Fortnite", "I achieved comedy", "my uncle loves it", "what the fuck", "it never gives me up", "it never lets me down", "oh shit", "how to fix it?", "wait, this is not Google"];
      var response = options[Math.floor(Math.random()*options.length)];
      var contentToSay = "I have " + pseudoEnglish[willSay] + "\n" + response;
    }
    else if (action == "homies") {
      var theHomies = ["love", "hate", "got", "play with", "use", "watch", "eat", "follow", "unfollowed", "believe in", "invented", "dance to", "listen to"];
      var chooseHomie = theHomies[Math.floor(Math.random()*theHomies.length)];
      var contentToSay = "I " + chooseHomie + " " + pseudoEnglish[willSay] + "\n" + "all my homies " + chooseHomie + " " + pseudoEnglish[willSay];
    }
    else {
      var contentToSay = "the game"
    }

    if(process.env.DEV == 0){
      T.post('statuses/update', { status: contentToSay }, function(err, data, response) {
        client.channels.get(consoleLogging).send("Tweeted: " + contentToSay)
      })
      store.channel.send(willSay + 1);
      client.user.setActivity("you | " + contentToSay.replace("\n", ", ") + ".", {type: 'WATCHING'}).then().catch(console.error);
      console.log("Successfully started up.");
    }
    else {
      client.user.setActivity("for updates | " + contentToSay.replace("\n", ", ") + ".", {type: 'WATCHING'}).then().catch(console.error);
      client.user.setStatus("dnd").then().catch(console.error);
      console.log("Running development instance.");
    }
  });
}
