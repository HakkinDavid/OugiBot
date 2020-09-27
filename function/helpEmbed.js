module.exports =

function (msg) {
  let commandsArray = ["say", "answer", "image", "translate", "music", "snipe", "embed", "learn", "emoji", "emoji-list"];
  var embed = new Discord.MessageEmbed()
  .setTitle("Help with Ougi")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setColor("#230347")
  .setDescription("Here's some information about what Ougi can do.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL())
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Ougi's prefix", "`ougi`\nThis is what you should start your message with if you want Ougi to perform any of the following commands.")
  .addField("Help command: `help`", "Shows this help menu. You may also use `help` and the name of another command to show detailed information about it.\n**Example:**\n`ougi help " + commandsArray[Math.floor(Math.random()*commandsArray.length)] + "`")
  .addField("Available commands", "As of now, Ougi has these commands: `say`, `answer`, `image`, `translate`, `music`, `skip`, `lyrics`, `snipe`, `embed`, `learn`, `forget`, `emoji`, `emoji-list`, `newspaper`, `subscribe`, `unsubscribe`, `prefix`, `remove`, `allow`, `setnews`, `setlog`, `acknowledgement` and `info`. Still improving!");

  msg.channel.send({embed}).catch(console.error);
}
