module.exports =

async function (msg) {
  let guildID = msg.guild.id;
  if (settingsOBJ.logging.hasOwnProperty(guildID)){
    let guildLogger = settingsOBJ.logging[guildID];

    let channelPointer = client.channels.cache.get(guildLogger);

    if (channelPointer == undefined) {
      console.log("Skipped invalid logging channel for " + msg.guild.toString() + ".");
      return
    }

    let spookyCake = msg.content;
    let spookySlices = spookyCake.split(" ");
    let spookyCommand = spookySlices[1];
    let arguments = spookySlices.slice(2);

    let embed = new Discord.MessageEmbed()
    .setTitle(msg.author.tag)
    .setDescription("ID `" + msg.author.id + "` | At " + msg.channel.toString())
    .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
    .setColor("#00E5FF")
    .setFooter("logEmbed by Ougi", msg.guild.iconURL())
    .setThumbnail(msg.author.avatarURL({dynamic: true, size: 4096}))
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

    channelPointer.send({embed}).catch(console.error);
  }
}
