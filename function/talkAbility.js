module.exports =

function talkAbility(msg) {
  msg.channel.startTyping();
  ougi.sleep(500);
  var spookyDM = msg.content.toLowerCase();
  if (spookyDM.includes("hi") || spookyDM.includes("hello") || spookyDM.includes("hey") || spookyDM.includes("goodmorning") || spookyDM.includes("good morning") || spookyDM.includes("gm")) {
    var options = ["Hello", "Hi", "Hey!", ":flushed:", "<:clownflushed:630142296293376060>", "ola bb"];
  }
  else if (spookyDM.includes("bye") || spookyDM.includes("goodbye") || spookyDM.includes("sayonara") || spookyDM.includes("goodnight") || spookyDM.includes("good night") || spookyDM.includes("gn")) {
    var options = ["See you later!", "Sayonara", "Goodbye", "Oh, bye."];
  }
  else if (spookyDM.includes('ola bb')) {
    var options = ["ola bb", "ola", "k pasa bb", "ontas¿"];
  }
  else if (spookyDM.includes('k pasa bb') || spookyDM.includes('k hay bb') || spookyDM.includes('k ases bb')) {
    var options = ["nada bb", "aki solita", "tengo amvre", "kiero tu enshilada bb", "a punto de mandarte un paketaxo por fedex"];
  }
  else if (spookyDM.includes("how are you") || spookyDM.includes("how you doin") || spookyDM.includes("how are u") || spookyDM.includes("how r u")) {
    var options = ["I'm doing well.", "I'm platinum mad.", "Who cares?", "I'm dizzy.", "I'm hungry.", "sPoOoOoOoOoOoOoKy", "Online.", "I'd say I'm up and running but I prefer riding a bicycle.", "I'm <:clownflushed:630142296293376060>. Is that even a valid response?", "I'm feeling happy. What about you?", "I'm craving some food.", "I'm just having an existential crisis: Does the Lighting McQueen have life insurance or car insurance?", "I'm eating some popcorns.", "I'm planning a way to defeat all those zombies around my Minecraft house.", "I'm *doing homework* but I should be doing homework.", "Have you ever played a videogame world cup and ranked first place? Neither me, but I'm making some coffee.", "I'm having a déjà vu.", "I'm really confused. You see, I was reading a book, called 'sʞooq pɐǝɹ oʇ ʍoH', I didn't understand a single word.", "I'm bored.", "I'm having a headache.", "I'm online.", "I feel kinda confused, is a *taco* the same thing as a *sope* or an *enchilada*? I mean after all these are *tortillas* with stuff like meat or cheese.", "I'm kinda sad. My ice cream melted before I even tasted it.", "I want to know why roses are red and violets are blue.", "I'm glad to have someone talking to me.", "I heard the convenience store is selling [愛] love. Can you lend me 298 yen?"];
  }
  else if (spookyDM.includes("happy") || spookyDM.includes("fine")) {
    var options = ["That's great.", "wowie", "Good to hear that.", ":D"];
  }
  else if (spookyDM.includes("vibe check")){
    if (msg.author.id == "504307125653078027" ) { var options = ["B O O !", "NANI? NANI? NANI? O-ONII~ ONII-CHAN, I'M HERE, D-DO WITH ME WH-WHATEVER YOU PLEASE!", "Ara ara, onii-chan! Next time I'm gonna vibe check you **S O   H A R D**.", "Do you think it's okay to vibe check people hiding behind a screen? Come here and vibe check me really hard, onii-chan."]; }
    else { var options = ["BOO!", "NANI? NANI? NANI? I'm online.", "Next time I'm gonna vibe check you back.", "ah shit, here we go again"]; }
  }
  else {
    ougi.undefinedCommand(arguments, msg)
    msg.channel.stopTyping();
    return
  }
  var response = options[Math.floor(Math.random()*options.length)];
  msg.channel.send(response).then().catch(console.error);
  msg.channel.stopTyping();
}
