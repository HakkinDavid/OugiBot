module.exports =

async function (arguments, msg) {
  if (!ougi.guildCheck(msg)) return;

  if (!ougi.adminCheck(msg)) return;

  let prefix = arguments.join(" ");

  if (arguments.length < 1) {
    msg.channel.send("You must specify a new prefix for Ougi. Refer to the following command for help.\n> ougi help prefix");
    return
  }
  msg.channel.send("Prefix for Ougi in " + msg.guild.toString() + " set as `" + prefix + "`.");

  settingsOBJ.prefix[msg.guildId] = prefix;
  await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
  await ougi.backup("./settings.txt", channels.settings);
}
