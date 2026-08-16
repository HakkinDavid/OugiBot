module.exports =

async function (arguments, msg) {
  if (!(await ougi.guildCheck(msg))) return;

  if (!(await ougi.adminCheck(msg))) return;

  let guildLogger = msg.channel.id;

  if (arguments.length > 0) {
    if (arguments[0] == "disable") {
      if (ougi.db().getLogChannel(msg.guildId)){
        ougi.db().deleteLogChannel(msg.guildId);
        msg.channel.send(await ougi.text(msg, "log_disabled"));
        return;
      }
      else {
        msg.channel.send(await ougi.text(msg, "log_notSet"));
        return;
      }
    }
    else if (arguments[0].startsWith("<#") && arguments[0].endsWith(">")) {
      let channelMention = arguments[0];
      channelMention = channelMention.slice(2, -1);
      if (!msg.guild.channels.cache.has(channelMention)) {
        msg.channel.send(await ougi.text(msg, "log_usageHelp"));
        return;
      }
      guildLogger = channelMention;
    }
    else {
      msg.channel.send(await ougi.text(msg, "log_usageHelp"));
      return;
    }
  }
  const channelSetTemplate = await ougi.text(msg, "log_channelSetDesc");
  msg.channel.send(channelSetTemplate.replace(/{channel}/g, guildLogger));

  ougi.db().setLogChannel(msg.guildId, guildLogger);
}
