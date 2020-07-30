module.exports =

function guildLog(msg) {
  var guildID = msg.guild.id;
  var pseudoArray = JSON.parse(fs.readFileSync('./guildLogs.txt', 'utf-8', console.error));
  if (pseudoArray.hasOwnProperty(guildID)){
    var guildLogger = pseudoArray[guildID];
    while (msg.content.includes('  ')) {
      msg.content = msg.content.replace('  ', ' ')
    }
    while (msg.content.includes('\n\n')) {
      msg.content = msg.content.replace('\n\n', '\n')
    }
    while (msg.content.includes('\n')) {
      msg.content = msg.content.replace('\n', ' ')
    }

    var spookyCake = msg.content;
    var spookySlices = spookyCake.toLowerCase().split(" ");
    var spookyCommand = spookySlices[1];
    var arguments = spookySlices.slice(2);

    var embed = new Discord.RichEmbed()
    .setTitle(msg.author.tag)
    .setDescription("ID `" + msg.author.id + "` | At " + msg.channel.toString())
    .setAuthor("Ougi [BOT]", client.user.avatarURL)
    .setColor("#00E5FF")
    .setFooter("logEmbed by Ougi", msg.guild.iconURL)
    .setThumbnail(msg.author.avatarURL)
    .setTimestamp()
    if (spookyCommand == undefined) {
      embed.addField("No trigger was specified", "\u200B")
    }
    else {
      embed.addField("Trigger", spookyCommand);
    }
    if (arguments != "") {
      arguments = arguments.join(" ");
      embed.addField("Arguments", arguments.slice(0, 1024));
    }

    client.channels.get(guildLogger).send({embed}).catch(console.error);
  }
}
