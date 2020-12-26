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

  let pseudoArray = JSON.parse(fs.readFileSync('./settings.txt', 'utf-8', console.error));
  let guildID = msg.guild.id;
  let prefix = arguments.join(" ");

  if (arguments.length < 1) {
    msg.channel.send("You must specify a new prefix for Ougi. Refer to the following command for help.\n> ougi help prefix");
    return
  }
  msg.channel.send("Prefix for Ougi in " + msg.guild.toString() + " set as `" + prefix + "`.");

  pseudoArray.prefix[guildID] = prefix;
  let proArray = JSON.stringify(pseudoArray);
  fs.writeFileSync('./settings.txt', proArray, console.error);
  let myPrefix = './settings.txt';
  ougi.backup(myPrefix, settingsChannel);
}
