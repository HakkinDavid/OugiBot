module.exports =

async function (arguments, msg) {
  if (!(await ougi.guildCheck(msg))) return;

  if (!(await ougi.adminCheck(msg))) return;

  let guildBump = msg.channel.id;
  let guildBumpRole = null;

  if (arguments.length > 0) {
    if (arguments[0] == "disable") {
      if (ougi.db().getBumpConfig(msg.guildId)){
        ougi.db().deleteBumpConfig(msg.guildId);
        msg.channel.send("Bump reminder channel successfully disabled.");
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

  const currentConfig = ougi.db().getBumpConfig(msg.guildId) || { channel: guildBump, role: guildBumpRole, next_bump: null, reminded: false };
  currentConfig.channel = guildBump;
  currentConfig.role = guildBumpRole;
  ougi.db().setBumpConfig(msg.guildId, currentConfig);
}
