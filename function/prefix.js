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
  let prefix = arguments.join(" ");

  if (arguments.length < 1) {
    msg.channel.send("You must specify a new prefix for Ougi. Refer to the following command for help.\n> ougi help prefix");
    return
  }
  msg.channel.send("Prefix for Ougi in " + msg.guild.toString() + " set as `" + prefix + "`.");

  settingsOBJ.prefix[guildID] = prefix;
  await fs.writeFile('./settings.txt', JSON.stringify(settingsOBJ), console.error);
  ougi.backup("./settings.txt", settingsChannel);
}
