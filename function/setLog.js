module.exports =

async function (arguments, msg) {
  if (msg.channel.type != "text") {
    msg.channel.send("You must be in a server to run this command.");
    return
  }

  let elAdmin = msg.guild.ownerID;

  if (elAdmin != msg.author.id) {
    msg.channel.send("You must be the server's owner to run this command.");
    return
  }

  let guildID = msg.guild.id;
  let guildLogger = msg.channel.id;

  if (arguments.length > 0) {
    if (arguments[0] == "disable") {
      if (settingsOBJ.logging.hasOwnProperty(guildID)){
        delete settingsOBJ.logging[guildID];
        msg.channel.send("Logging channel successfully disabled.");
        fs.writeFile('./settings.txt', JSON.stringify(settingsOBJ), console.error);
        ougi.backup("./settings.txt", settingsChannel);
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
  fs.writeFile('./settings.txt', JSON.stringify(settingsOBJ), console.error);
  ougi.backup("./settings.txt", settingsChannel);
}
