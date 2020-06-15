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

  console.log(guildID + guildLogger);

  if (arguments[0] == "disable") {
    if (pseudoArray.hasOwnProperty(guildID)){
      var toRM = pseudoArray.indexOf(guildID);
      pseudoArray.splice(toRM, 1);
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

  msg.channel.send("I'll start sending this server's command log into this channel.");

  pseudoArray[guildID] = [];
  var arrayMaker = pseudoArray[guildID];
  arrayMaker.push(guildLogger);
  pseudoArray[guildID] = arrayMaker;
  var proArray = JSON.stringify(pseudoArray);
  fs.writeFile('./guildLogs.txt', proArray, console.error);
  var myLogger = './guildLogs.txt';
  ougi.backup(myLogger, guildLoggerChannel);
}
