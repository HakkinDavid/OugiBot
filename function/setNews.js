module.exports =

async function (arguments, msg) {
  if (!(await ougi.guildCheck(msg))) return;

  if (!(await ougi.adminCheck(msg))) return;

  let guildNews = msg.channel.id;

  if (arguments.length > 0) {
    if (arguments[0] == "disable") {
      if (ougi.db().getNewsChannel(msg.guildId)){
        ougi.db().deleteNewsChannel(msg.guildId);
        msg.channel.send(await ougi.text({ msg, stringID: "news_disabled" }));
        return;
      }
      else {
        msg.channel.send(await ougi.text({ msg, stringID: "news_notSet" }));
        return;
      }
    }
    else if (arguments[0].startsWith("<#") && arguments[0].endsWith(">")) {
      let channelMention = arguments[0];
      channelMention = channelMention.slice(2, -1);
      if (!msg.guild.channels.cache.has(channelMention)) {
        msg.channel.send(await ougi.text({ msg, stringID: "news_usageHelp" }));
        return;
      }
      guildNews = channelMention;
    }
    else {
      msg.channel.send(await ougi.text({ msg, stringID: "news_usageHelp" }));
      return;
    }
  }

  msg.channel.send(await ougi.text({
    msg,
    stringID: "news_channelSetDesc",
    values: {
      channel: guildNews
    }
  }));

  ougi.db().setNewsChannel(msg.guildId, guildNews);
}
