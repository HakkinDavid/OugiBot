module.exports =

async function (msg, options) {
  let guildID = msg.guild.id;
  if (settingsOBJ.logging.hasOwnProperty(guildID)){
    let guildLogger = settingsOBJ.logging[guildID];

    let channelPointer = await client.channels.fetch(guildLogger);

    if (channelPointer === undefined) {
      ougi.globalLog("Skipped invalid logging channel for " + msg.guild.toString() + ".");
      return
    }
    
    let embed = new Discord.MessageEmbed()
    .setTitle(msg.author.tag)
    .setDescription("ID `" + msg.author.id + "` | At " + msg.channel.toString())
    .setAuthor("Ougi [BOT]", client.user.avatarURL({dynamic: true, size: 4096}))
    .setColor("#00E5FF")
    .setFooter("logEmbed by Ougi", msg.guild.iconURL())
    .setThumbnail(msg.author.avatarURL({dynamic: true, size: 4096}))
    .setTimestamp();

    if (options && options.type === 'economy') {
      if (options.income !== undefined) embed.setDescription("Cash: `" + (options.income > 0 ? "+" + options.income : options.income) + "`");
      if (options.reason) embed.addField(await ougi.text(msg, options.reason), "\u200b");
    }

    else {
      if (msg.content.length > 1024) {
        embed.addField("Content", msg.content.slice(0,1024));
        embed.addField("\u200b", msg.content.slice(1024));
      }
      else {
          embed.addField("Content", msg.content);
      }
    }


    channelPointer.send({embed}).catch(console.error);
  }
}
