module.exports =

function guildLog(msg) {
  var guildID = msg.guild.id;
  var pseudoArray = JSON.parse(fs.readFileSync('./guildLogs.txt', 'utf-8', console.error));
  if (pseudoArray.hasOwnProperty(guildID)){
    var guildLogger = pseudoArray[guildID];
    while (msg.cleanContent.includes('  ')) {
      msg.cleanContent = msg.cleanContent.replace('  ', ' ')
    }
    while (msg.cleanContent.includes('\n\n')) {
      msg.cleanContent = msg.cleanContent.replace('\n\n', '\n')
    }
    while (msg.cleanContent.includes('\n')) {
      msg.cleanContent = msg.cleanContent.replace('\n', ' ')
    }

    var spookyCake = msg.cleanContent;
    var spookySlices = spookyCake.toLowerCase().split(" ");
    var spookyCommand = spookySlices[1];
    var arguments = spookySlices.slice(2);

    var event = new Date();

    var spookyLog = "__**" + event.toLocaleTimeString('en-US') + "**__\nCommand received: " + spookyCommand + "\nArguments: " + arguments + "\nExecuted by: `" + msg.author.tag + "` with ID: `" + msg.author.id + "` in channel: " + msg.channel.toString();

    client.channels.get(guildLogger).send(spookyLog.replace("@everyone", "@.everyone").replace("@here", "@.here")).catch(console.error);
  }
}
