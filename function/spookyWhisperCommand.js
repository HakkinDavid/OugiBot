module.exports =

function spookyWhisperCommand(arguments, msg) {
  var dmUsers = fs.readFileSync('../dmUsers").toString('utf-8');
  var dmAble = dmUsers.split("\n");
  var dmID = fs.readFileSync('../dmID");
  var spookyIDs = dmID.split("\n");
  var finalDestination = arguments[0].replace("@", "")
  if (spookyIDs.includes(msg.author.id)) {
    if (!dmAble.includes(finalDestination)) {
      msg.channel.send("Sorry but your buddy hasn't been spookified. Ask them to tell *me* `spookify`");
    }
  }
  else if (!spookyIDs.includes(msg.author.id)) {
    msg.channel.send("In order to spooky-whisper someone else through DMs, you must agree to receive those whisperings aswell. Tell *me* `spookify`");
  }
}
