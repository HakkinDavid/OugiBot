module.exports =

function nowHelp(msg) {
  var options = ["I'm feeling happy. What about you?", "I'm craving some food.", "It's a beatiful day outside, don't you think so? Flowers are singing, birds are blooming. *Wait, I screwed it up.*", "I'm just having an existential crisis: Does the Lighting McQueen have life insurance or car insurance?", "I'm eating some popcorns.", "I'm planning a way to defeat all those zombies around my Minecraft house.", "I'm *doing homework* but I should be doing homework.", "Have you ever played a videogame world cup and ranked first place? Neither me, but I'm making some coffee.", "I'm having a déjà vu.", "I was reading a book, called 'sʞooq pɐǝɹ oʇ ʍoH', I didn't understand a single word.", "Yesterday, I was back in the mine, got my pickaxe swinging from side to side, hoping to find some diamonds. When I thought I was safe, I overheard some hissing from right behind. Aw man.", "Hate me or love me, I tried playing Fortnite. Apparently I have to download it.", "I saw some memes today.", "I'm bored.", "I'm having a headache.", "I'm online.", "I feel confused, is a *taco* the same thing as a *sope* or an *enchilada*? I mean after all these are *tortillas* with stuff like meat or cheese.", "I'm kinda sad. My ice cream melted before I even tasted it.", "I want to know why roses are red and violets are blue.", "Is life made of 5 protons or why is it so Boron?", "I'm glad to have someone talking to me.", "I heard the convenience store is selling [愛] love. Can you lend me 298 yen?"];
  var response = options[Math.floor(Math.random()*options.length)];
  var embed = new Discord.RichEmbed()
  .setTitle("Ougi's `now` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL)
  .setColor("#230347")
  .setDescription("This command makes Ougi send a random thought.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi now`")
  .addField("Output", response)

  msg.channel.send({embed}).catch(console.error);
}
