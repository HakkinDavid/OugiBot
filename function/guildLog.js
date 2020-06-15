module.exports =

function guildLog(msg) {
  var guildID = msg.guild.id;
  var pseudoArray = JSON.parse(fs.readFileSync('./guildLogs.txt', 'utf-8', console.error));
  if (pseudoArray.hasOwnProperty(guildID)){
    var guildLogger = pseudoArray[guildID];
    while (msg.content.includes('  ')) {
      msg.content = msg.content.replace('  ', ' ')
    }
    while (msg.content.includes('\n\n')) {
      msg.content = msg.content.replace('\n\n', '\n')
    }
    while (msg.content.includes('\n')) {
      msg.content = msg.content.replace('\n', ' ')
    }

    var spookyCake = msg.content;
    var spookySlices = spookyCake.toLowerCase().split(" ");
    var spookyCommand = spookySlices[1];
    var arguments = spookySlices.slice(2);

    var event = new Date();

    var spookyLog = "__**" + event.toLocaleTimeString('en-US') + "**__\nCommand received: " + spookyCommand + "\nArguments: " + arguments + "\nExecuted by: `" + msg.author.tag + "` with ID: `" + msg.author.id + "` in channel: `" + msg.channel.toString() + "`";

    client.channels.get(guildLogger).send(spookyLog.replace("@everyone", "@.everyone").replace("@here", "@.here")).catch(console.error);
  }
}
