module.exports =

function globalLog(msg) {
  var spookyCake = msg.cleanContent;
  var spookySlices = spookyCake.toLowerCase().split(" ");
  var spookyCommand = spookySlices[1];
  var arguments = spookySlices.slice(2);

  var event = new Date();

  var spookyLog = "__**" + event.toLocaleTimeString('en-US') + "**__\nCommand received: " + spookyCommand + "\nArguments: " + arguments + "\nExecuted by: `" + msg.author.tag + "` with ID: `" + msg.author.id + "`";

  console.log(spookyLog);
}
