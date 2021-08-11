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

    let embed = new Discord.MessageEmbed()
    .setTitle(msg.author.tag)
    .setDescription("ID `" + msg.author.id + "` | At " + msg.channel.toString())
    .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
    .setColor("#00E5FF")
    .setFooter("logEmbed by Ougi", msg.guild.iconURL())
    .setThumbnail(msg.author.avatarURL({dynamic: true, size: 4096}))
    .setTimestamp()
    embed.addField("Content", msg.content);

    channelPointer.send({embed}).catch(console.error);
  }
}
