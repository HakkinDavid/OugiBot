module.exports =

async function (arguments, msg) {
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    msg.channel.send(await ougi.text(msg, "mustGuild"));
    return
  }

  let elAdmin = msg.guild.ownerID;

  if (elAdmin != msg.author.id) {
    msg.channel.send("You must be the server's owner to run this command.");
    return
  }

  let guildID = msg.guild.id;
  let guildNews = msg.channel.id;

  if (arguments.length < 0) {
    if (arguments[0] == "disable") {
      if (settingsOBJ.guildNews.hasOwnProperty(guildID)){
        delete settingsOBJ.guildNews[guildID];
        msg.channel.send("Newsletter channel successfully disabled.");
        await ougi.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);
        await ougi.backup("./settings.txt", settingsChannel);
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
      if (!msg.guild.channels.has(channelMention)) {
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

  settingsOBJ.guildNews[guildID] = guildNews;
  await ougi.writeFile('./settings.txt', JSON.stringify(settingsOBJ, null, 4), console.error);
  await ougi.backup("./settings.txt", settingsChannel);
}
