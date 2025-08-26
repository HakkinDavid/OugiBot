module.exports =

async function (arguments, msg) {
  if (msg.channel.type !== Discord.ChannelType.GuildText) {
    msg.channel.send(await ougi.text(msg, "mustGuild"));
    return
  }

  let elAdmin = msg.guild.ownerId;

  if (elAdmin != msg.author.id) {
    msg.channel.send("You must be the server's owner to run this command.");
    return
  }

  let guildID = msg.guildId;
  let guildBump = msg.channel.id;
  let guildBumpRole = null;

  if (arguments.length > 0) {
    if (arguments[0] == "disable") {
      if (settingsOBJ.guildBump.hasOwnProperty(guildID)){
        delete settingsOBJ.guildBump[guildID];
        msg.channel.send("Bump reminder channel successfully disabled.");
        await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
        await ougi.backup("./settings.txt", channels.settings);
        return
      }
      else {
        msg.channel.send("There was no bump reminder channel set.");
        return
      }
    }
    else {
      guildBump = msg.guild.channels.cache.has(msg.mentions.channels.first()?.id) ? msg.mentions.channels.first()?.id : guildBump;
      guildBumpRole = msg.guild.roles.cache.has(msg.mentions.roles.first()?.id) ? msg.mentions.roles.first()?.id : null;
    }
  }

  msg.channel.send("I'll remind " + (guildBumpRole ? "<@&" + guildBumpRole + ">" : "you all") + " to bump in <#"+ guildBump +">.");

  if (!settingsOBJ.guildBump.hasOwnProperty(guildID)) {
    ougi.globalLog("Initializing remindBump in " + msg.guild.toString() + ".");
    settingsOBJ.guildBump[guildID] = {channel: guildBump, role: guildBumpRole, next_bump: null, reminded: false};
  }
  settingsOBJ.guildBump[guildID].channel = guildBump;
  settingsOBJ.guildBump[guildID].role = guildBumpRole;
  await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
  await ougi.backup("./settings.txt", channels.settings);
}
