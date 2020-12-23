module.exports =

function (msg) {
  let guildID = msg.guild.id;
  let pseudoArray = JSON.parse(fs.readFileSync('./settings.txt', 'utf-8', console.error));
  if (pseudoArray.logging.hasOwnProperty(guildID)){
    let guildLogger = pseudoArray.logging[guildID];
    let spookyCake = msg.content;
    let spookySlices = spookyCake.split(" ");
    let spookyCommand = spookySlices[1];
    let arguments = spookySlices.slice(2);

    let embed = new Discord.MessageEmbed()
    .setTitle(msg.author.tag)
    .setDescription("ID `" + msg.author.id + "` | At " + msg.channel.toString())
    .setAuthor("Ougi [BOT]", client.user.avatarURL())
    .setColor("#00E5FF")
    .setFooter("logEmbed by Ougi", msg.guild.iconURL())
    .setThumbnail(msg.author.avatarURL())
    .setTimestamp()
    if (spookyCommand == undefined) {
      embed.addField("No trigger was specified", "\u200B")
    }
    else {
      embed.addField("Trigger", spookyCommand);
    }
    if (arguments != "") {
      arguments = arguments.join(" ");
      if (arguments.length < 1024) {
        embed.addField("Arguments", arguments)
      }
      else {
        embed.addField("Arguments", arguments.slice(0, 1024))
        embed.addField("\u200B", arguments.slice(1024))
      }
    }

    client.channels.cache.get(guildLogger).send({embed}).catch(console.error);
  }
}
