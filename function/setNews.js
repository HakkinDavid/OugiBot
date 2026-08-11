module.exports =

async function (arguments, msg) {
  if (!(await ougi.guildCheck(msg))) return;

  if (!(await ougi.adminCheck(msg))) return;

  let guildNews = msg.channel.id;

  if (arguments.length > 0) {
    if (arguments[0] == "disable") {
      if (settingsOBJ.guildNews.hasOwnProperty(msg.guildId)){
        delete settingsOBJ.guildNews[msg.guildId];
        msg.channel.send("Newsletter channel successfully disabled.");
        ougi.db().saveKV('settings', 'kv', 'settingsOBJ', settingsOBJ);
        return
      }
      else {
        msg.channel.send("There was no newsletter channel set.");
        return
      }
    }
    else if (arguments[0].startsWith("<#") && arguments[0].endsWith(">")) {
      let channelMention = arguments[0];
      channelMention = channelMention.slice(2, -1);
      if (!msg.guild.channels.cache.has(channelMention)) {
        msg.channel.send("Huh? Looks like you're using this command wrong. Refer to the following command for help.\n> ougi help setnews");
        return
      }
      guildNews = channelMention;
    }
    else {
      msg.channel.send("Huh? Looks like you're using this command wrong. Refer to the following command for help.\n> ougi help setnews");
      return
    }
  }

  msg.channel.send("I'll start sending updates and related information into <#"+ guildNews +">.");

  settingsOBJ.guildNews[msg.guildId] = guildNews;
  ougi.db().saveKV('settings', 'kv', 'settingsOBJ', settingsOBJ);
}
