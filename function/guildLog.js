module.exports =

async function (msg, options) {
  let guildLogger = ougi.db().getLogChannel(msg.guildId);
  if (guildLogger) {

    let channelPointer = await client.channels.fetch(guildLogger);

    if (channelPointer === undefined) {
      const skipLog = await ougi.text({
        lang: 'en',
        stringID: "log_skippedInvalidLogging",
        values: {
          guild: msg.guild.toString()
        }
      });
      ougi.globalLog(skipLog);
      return
    }
    
    let embed = new Discord.EmbedBuilder()
    .setTitle(msg.author.username)
    .setDescription("ID `" + msg.author.id + "` | At " + msg.channel.toString())
    .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
    .setColor("#00E5FF")
    .setFooter({text: await ougi.text({ msg, stringID: "log_guildEmbedFooter" }), icon: msg.guild.iconURL()})
    .setThumbnail(msg.author.avatarURL({dynamic: true, size: 4096}))
    .setTimestamp();

    if (options && options.type === 'economy') {
      if (options.income !== undefined) embed.setDescription("Cash: `" + (options.income > 0 ? "+" + options.income : options.income) + "`");
      if (options.reason) embed.addFields({name: await ougi.text({ msg, stringID: options.reason }), value: "\u200b"});
    }

    else {
      const content = msg.content || "";
      const contentFieldName = await ougi.text({ msg, stringID: "log_contentField" });
      if (content.length > 0) {
        let trimmed = content;
        let first = true;
        while (trimmed.length > 0 && (!embed.data.fields || embed.data.fields.length < 24)) {
          const chunk = trimmed.slice(0, 1024);
          embed.addFields({ name: first ? contentFieldName : "\u200b", value: chunk || "\u200b" });
          trimmed = trimmed.slice(1024);
          first = false;
        }
      } else {
        embed.addFields({ name: contentFieldName, value: await ougi.text({ msg, stringID: "log_contentEmpty" }) });
      }
    }


    channelPointer.send({embeds: [embed]}).catch(console.error);
  }
}
