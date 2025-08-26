module.exports =

async function (arguments, msg) {
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    msg.channel.send(await ougi.text(msg, "mustGuild"));
    return
  }

  let elAdmin = msg.guild.ownerId;

  if (elAdmin != msg.author.id) {
    msg.channel.send(await ougi.text(msg, "mustOwn"));
    return
  }

  let guildID = msg.guildId;
  let guildLogger = msg.channel.id;

  if (arguments.length > 0) {
    if (arguments[0] == "disable") {
      if (settingsOBJ.logging.hasOwnProperty(guildID)){
        delete settingsOBJ.logging[guildID];
        msg.channel.send("Logging channel successfully disabled.");
        await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
        await ougi.backup("./settings.txt", channels.settings);
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

  settingsOBJ.logging[guildID] = guildLogger;
  await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
  await ougi.backup("./settings.txt", channels.settings);
}
