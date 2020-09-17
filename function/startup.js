module.exports =

function () {
  var iSaid = client.channels.cache.get(wordsChannel).messages.fetch({ limit: 1 }).then(messages => {
    let store = messages.first().content;
    let willSay = store * 1;
    let pseudoEnglish = JSON.parse(fs.readFileSync('./spookyWords', 'utf-8', console.error));
    let pick = ["have", "homies"];
    let action = pick[Math.floor(Math.random()*pick.length)];

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

    let guildsLength = client.guilds.cache.map((g) => g.toString()).length;

    if(process.env.DEV == 0){
      T.post('statuses/update', { status: contentToSay }, function(err, data, response) {
        client.channels.cache.get(consoleLogging).send("Tweeted: " + contentToSay)
      })
      var gonnaSay = willSay + 1;
      client.channels.cache.get(wordsChannel).send(gonnaSay.toString());
      client.user.setPresence({activity: { name: guildsLength + " guilds | " + contentToSay.replace("\n", ", ") + ".", type: 'WATCHING' }, status:'online'}).then().catch(console.error);
      console.log("Successfully started up.");
    }
    else {
      client.user.setPresence({activity: { name: "for updates | " + contentToSay.replace("\n", ", ") + ".", type: 'WATCHING' }, status:'dnd'}).then().catch(console.error);
      console.log("Running development instance.");
    }
  });
}
