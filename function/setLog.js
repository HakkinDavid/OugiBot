module.exports =

function setLog(arguments, msg) {
  if (msg.channel.type != "text") {
    msg.channel.send("You must be in a server to run this command.");
    return
  }

  var elAdmin = msg.guild.ownerID;

  if (elAdmin != msg.author.id) {
    msg.channel.send("You must be the server's owner to run this command.");
    return
  }

  var pseudoArray = JSON.parse(fs.readFileSync('./guildLogs.txt', 'utf-8', console.error));
  var guildID = msg.guild.id;
  var guildLogger = msg.channel.id;

  if (arguments[0] == "disable") {
    if (pseudoArray.hasOwnProperty(guildID)){
      delete pseudoArray[guildID];
      msg.channel.send("Logging channel successfully disabled.");
      var proArray = JSON.stringify(pseudoArray);
      fs.writeFile('./guildLogs.txt', proArray, console.error);
      var myLogger = './guildLogs.txt';
      ougi.backup(myLogger, guildLoggerChannel);
      return
    }
    else {
      msg.channel.send("There was no command logging channel set.");
      return
    }
  }
  else if (arguments[0].startsWith("<#") && arguments[0].endsWith(">")) {
    var channelMention = arguments[0];
    channelMention = channelMention.slice(2, -1);
    if (!msg.guild.channels.has(channelMention)) {
      msg.channel.send("Huh? Looks like you're using this command wrong. Refer to the following command for help.\n> ougi help setlog");
      return
    }
    guildLogger = channelMention;
  }
  else if (arguments[0] != undefined) {
    msg.channel.send("Huh? Looks like you're using this command wrong. Refer to the following command for help.\n> ougi help setlog");
    return
  }

  msg.channel.send("I'll start sending this server's commands log into <#"+ guildLogger +">.");

  pseudoArray[guildID] = guildLogger;
  var proArray = JSON.stringify(pseudoArray);
  fs.writeFile('./guildLogs.txt', proArray, console.error);
  var myLogger = './guildLogs.txt';
  ougi.backup(myLogger, guildLoggerChannel);
}
