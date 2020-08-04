module.exports =

function helpEmbed(msg) {
  var embed = new Discord.RichEmbed()
  .setTitle("Help with Ougi")
  .setAuthor("Ougi [BOT]", client.user.avatarURL)
  .setColor("#230347")
  .setDescription("Here's some information about what Ougi can do.")
  .setFooter("helpEmbed by Ougi", client.user.avatarURL)
  .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/help.png?raw=true")
  .addField("Ougi's prefix", "`ougi`\nThis is what you should start your message with if you want Ougi to perform any of the following commands.")
  .addField("Help command: `help`", "Shows this help menu. You may also use `help` and the name of another command to show detailed information about it.\n**Example:**\n`ougi help image`")
  .addField("Available commands", "As of now, Ougi has these commands: `say`, `answer`, `image`, `translate`, `snipe`, `embed`, `learn`, `emoji`, `emoji-list`, `subscribe`, `unsubscribe`, `remove`, `allow`, `setnews`, `setlog` and `info`. Still improving!");

  msg.channel.send({embed}).catch(console.error);
}
