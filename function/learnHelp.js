module.exports =

function (msg) {
  var phrases = ["johnny", "foo", "never gonna give, never gonna give"];
  var matchingreply = ["test", "bar", "(give you up)"];
  var trigger = phrases[Math.floor(Math.random()*phrases.length)];
  var response = matchingreply[phrases.indexOf(trigger)];
  var afterOptions = [
    "I'll start replying `" + response + "` when anyone says `" + trigger + "`",
    "Of course I already knew I should say `" + response + "` when anyone says `" + trigger + "`, I was just making sure you knew too~"
  ];
  var answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];
  var embed = new Discord.RichEmbed()
  .setTitle("Ougi's `learn` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL)
  .setColor("#230347")
  .setDescription("Make Ougi learn something new! You just gotta provide a trigger phrase and the desired response, separated by two slashes.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi learn " + trigger + " // " + response + "`")
  .addField("Output", answer)
  .addField("Note", "In order to use the content you taught Ougi, write a message starting with `ougi`, followed by whatever the trigger phrase was. There's also the option to DM Ougi, in which using the prefix for this matter is optional.")
  .addField("Using the trigger phrase", "`ougi " + trigger + "`")
  .addField("Ougi will reply", response)

  msg.channel.send({embed}).catch(console.error);
}
