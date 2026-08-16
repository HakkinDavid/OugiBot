module.exports =

async function (arguments, msg) {
  if (!(await ougi.guildCheck(msg))) return;

  if (!(await ougi.adminCheck(msg))) return;

  let guildNews = msg.channel.id;

  if (arguments.length > 0) {
    if (arguments[0] == "disable") {
      if (ougi.db().getNewsChannel(msg.guildId)){
        ougi.db().deleteNewsChannel(msg.guildId);
        msg.channel.send(await ougi.text(msg, "news_disabled"));
        return;
      }
      else {
        msg.channel.send(await ougi.text(msg, "news_notSet"));
        return;
      }
    }
    else if (arguments[0].startsWith("<#") && arguments[0].endsWith(">")) {
      let channelMention = arguments[0];
      channelMention = channelMention.slice(2, -1);
      if (!msg.guild.channels.cache.has(channelMention)) {
        msg.channel.send(await ougi.text(msg, "news_usageHelp"));
        return;
      }
      guildNews = channelMention;
    }
    else {
      msg.channel.send(await ougi.text(msg, "news_usageHelp"));
      return;
    }
  }

  const newsSetTemplate = await ougi.text(msg, "news_channelSetDesc");
  msg.channel.send(newsSetTemplate.replace(/{channel}/g, guildNews));

  ougi.db().setNewsChannel(msg.guildId, guildNews);
}
