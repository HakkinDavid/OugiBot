module.exports =

async function (msg) {
  var phrases = ["johnny", "foo", "never gonna give, never gonna give"];
  var matchingreply = ["test", "bar", "(give you up)"];
  var trigger = phrases[Math.floor(Math.random()*phrases.length)];
  var response = matchingreply[phrases.indexOf(trigger)];
  var afterOptions = [
    "I'll stop replying `" + response + "` when anyone says `" + trigger + "`",
    "Of course I already knew I shouldn't say `" + response + "` when anyone says `" + trigger + "`"
  ];
  var answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];
  var embed = new Discord.MessageEmbed()
  .setTitle("Ougi's `forget` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setDescription("Make Ougi forget something, just like in Men In Black! You must provide both, the trigger phrase and the desired response to delete, separated by two colons (::), if you delete the last response available for a trigger, the trigger gets deleted too.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi forget " + trigger + " :: " + response + "`")
  .addField("Output", answer)

  msg.channel.send({embed}).catch(console.error);
}
