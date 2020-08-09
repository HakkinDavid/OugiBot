module.exports =

function (channel) {

  var guildID = channel.guild.id;

  var pseudoArray = JSON.parse(fs.readFileSync('./guildLogs.txt', 'utf-8', console.error));

  if (pseudoArray.hasOwnProperty(guildID)){
    delete pseudoArray[guildID];
    client.channels.cache.get(consoleLogging).send("Logging channel for " + channel.guild.toString() + " successfully auto-disabled on deletion.");
    var proArray = JSON.stringify(pseudoArray);
    fs.writeFile('./guildLogs.txt', proArray, console.error);
    var myLogger = './guildLogs.txt';
    ougi.backup(myLogger, guildLoggerChannel);
    return
  }

  var handyArray = JSON.parse(fs.readFileSync('./guildNews.txt', 'utf-8', console.error));
  if (pseudoArray.hasOwnProperty(guildID)){
    delete handyArray[guildID];
    client.channels.cache.get(consoleLogging).send("News channel for " + channel.guild.toString() + " successfully auto-disabled on deletion.");
    var epicArray = JSON.stringify(handyArray);
    fs.writeFile('./guildNews.txt', epicArray, console.error);
    var myNewspaper = './guildNews.txt';
    ougi.backup(myNewspaper, guildNewsChannel);
    return
  }
}
