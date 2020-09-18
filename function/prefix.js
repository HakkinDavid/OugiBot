module.exports =

function (arguments, msg) {
  if (msg.channel.type != "text") {
    msg.channel.send("You must be in a server to run this command.");
    return
  }

  var elAdmin = msg.guild.ownerID;

  if (elAdmin != msg.author.id) {
    msg.channel.send("You must be the server's owner to run this command.");
    return
  }

  var pseudoArray = JSON.parse(fs.readFileSync('./guildPrefix.txt', 'utf-8', console.error));
  var guildID = msg.guild.id;
  var prefix = arguments.join(" ");

  if (arguments.length < 1) {
    msg.channel.send("You must specify a new prefix for Ougi. Refer to the following command for help.\n> ougi help prefix");
    return
  }
  msg.channel.send("Prefix for Ougi in " + msg.guild.toString() + " set as `" + prefix + "`.");

  pseudoArray[guildID] = prefix;
  var proArray = JSON.stringify(pseudoArray);
  fs.writeFileSync('./guildPrefix.txt', proArray, console.error);
  let myPrefix = './guildPrefix.txt';
  ougi.backup(myPrefix, guildPrefixChannel);
}
