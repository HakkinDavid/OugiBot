module.exports =

function autoRMChannel(channel) {

  var guildID = channel.guild.id;

  var pseudoArray = JSON.parse(fs.readFileSync('./guildLogs.txt', 'utf-8', console.error));

  if (pseudoArray.hasOwnProperty(guildID)){
    delete pseudoArray[guildID];
    console.log("Logging channel for " + channel.guild.toString() + " successfully auto-disabled on deletion.");
    var proArray = JSON.stringify(pseudoArray);
    fs.writeFile('./guildLogs.txt', proArray, console.error);
    var myLogger = './guildLogs.txt';
    ougi.backup(myLogger, guildLoggerChannel);
    return
  }
}
