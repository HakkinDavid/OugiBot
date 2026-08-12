module.exports =

async function (arguments, msg) {
  if (!(await ougi.guildCheck(msg))) return;

  if (!(await ougi.adminCheck(msg))) return;

  let guildLogger = msg.channel.id;

  if (arguments.length > 0) {
    if (arguments[0] == "disable") {
      if (ougi.db().getLogChannel(msg.guildId)){
        ougi.db().deleteLogChannel(msg.guildId);
        msg.channel.send("Logging channel successfully disabled.");
        return
      }
      else {
        msg.channel.send("There was no command logging channel set.");
        return
      }
    }
    else if (arguments[0].startsWith("<#") && arguments[0].endsWith(">")) {
      let channelMention = arguments[0];
      channelMention = channelMention.slice(2, -1);
      if (!msg.guild.channels.cache.has(channelMention)) {
        msg.channel.send("Huh? Looks like you're using this command wrong. Refer to the following command for help.\n> ougi help setlog");
        return
      }
      guildLogger = channelMention;
    }
    else {
      msg.channel.send("Huh? Looks like you're using this command wrong. Refer to the following command for help.\n> ougi help setlog");
      return
    }
  }
  msg.channel.send("I'll start sending this server's commands log into <#"+ guildLogger +">.");

  ougi.db().setLogChannel(msg.guildId, guildLogger);
}
