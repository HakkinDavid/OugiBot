module.exports =

function answerHelp(msg) {
  var options = ["Yes", "No", "Yeah", "Nah", "Maybe", "Maybe not", "I guess", "I guess not", "I don't know, so I can't actually answer.", "I'm not sure.", "Ask someone else.", "Negative", "Negative multiplied by negative.", "Pancakes", "**Impossible**", "I don't know, but you do.", "Do you really want me to answer that?", "Uhhh"]
  var response = options[Math.floor(Math.random()*options.length)];
  var phrases = ["do you like tacos?", "are you human?", "are you ever gonna give me up?"];
  var question = phrases[Math.floor(Math.random()*phrases.length)];
  var embed = new Discord.RichEmbed()
  .setTitle("Ougi's `answer` command")
  .setAuthor("Ougi [BOT]", client.user.avatarURL)
  .setColor("#230347")
  .setDescription("Ask Ougi a yes-or-no question.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Example", "`ougi answer " + question + "`")
  .addField("Output", response)

  msg.channel.send({embed}).catch(console.error);
}
