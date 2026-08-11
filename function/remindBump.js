module.exports =

async function (arguments, msg) {
  if (!(await ougi.guildCheck(msg))) return;

  if (!(await ougi.adminCheck(msg))) return;

  let guildBump = msg.channel.id;
  let guildBumpRole = null;

  if (arguments.length > 0) {
    if (arguments[0] == "disable") {
      if (settingsOBJ.guildBump.hasOwnProperty(msg.guildId)){
        delete settingsOBJ.guildBump[msg.guildId];
        msg.channel.send("Bump reminder channel successfully disabled.");
        ougi.db().saveKV('settings', 'kv', 'settingsOBJ', settingsOBJ);
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

  if (!settingsOBJ.guildBump.hasOwnProperty(msg.guildId)) {
    ougi.globalLog("Initializing remindBump in " + msg.guild.toString() + ".");
    settingsOBJ.guildBump[msg.guildId] = {channel: guildBump, role: guildBumpRole, next_bump: null, reminded: false};
  }
  settingsOBJ.guildBump[msg.guildId].channel = guildBump;
  settingsOBJ.guildBump[msg.guildId].role = guildBumpRole;
  ougi.db().saveKV('settings', 'kv', 'settingsOBJ', settingsOBJ);
}
