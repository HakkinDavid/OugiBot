module.exports =

async function (msg, options) {
  let guildID = msg.guildId;
  if (settingsOBJ.logging.hasOwnProperty(guildID)){
    let guildLogger = settingsOBJ.logging[guildID];

    let channelPointer = await client.channels.fetch(guildLogger);

    if (channelPointer === undefined) {
      ougi.globalLog("Skipped invalid logging channel for " + msg.guild.toString() + ".");
      return
    }
    
    let embed = new Discord.EmbedBuilder()
    .setTitle(msg.author.username)
    .setDescription("ID `" + msg.author.id + "` | At " + msg.channel.toString())
    .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
    .setColor("#00E5FF")
    .setFooter({text: "logEmbed by Ougi", icon: msg.guild.iconURL()})
    .setThumbnail(msg.author.avatarURL({dynamic: true, size: 4096}))
    .setTimestamp();

    if (options && options.type === 'economy') {
      if (options.income !== undefined) embed.setDescription("Cash: `" + (options.income > 0 ? "+" + options.income : options.income) + "`");
      if (options.reason) embed.addFields({name: await ougi.text(msg, options.reason), value: "\u200b"});
    }

    else {
      if (msg.content.length > 1024) {
        embed.addFields({name: "Content", value: msg.content.slice(0,1024)});
        embed.addFields({name: "\u200b", value: msg.content.slice(1024)});
      }
      else {
          embed.addFields({name: "Content", value: msg.content});
      }
    }


    channelPointer.send({embeds: [embed]}).catch(console.error);
  }
}
