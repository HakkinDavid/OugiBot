module.exports =

function (arguments, msg) {
  var spookyCake = msg.content;
  var spookySlices = spookyCake.replace("\n", " ").split(" ");
  var spookyCommand = spookySlices[1];
  var arguments = spookySlices.slice(2);

  if (arguments.length !== 1){
    msg.channel.send("Please provide a nickname you'd like to delete. Any characters (included emojis) are allowed but avoid spaces.").then().catch(console.error);
    return
  }
  var pseudoArray = JSON.parse(fs.readFileSync('./dmUsers', 'utf-8', console.error));
  var callerTag = arguments[0];
  var callerID = msg.author.id;

  if (!pseudoArray.hasOwnProperty(callerTag)){
    msg.channel.send("Gomen'nasai but such spooky nickname doesn't exist.").then().catch(console.error);
    return
  }
  if (pseudoArray[callerTag] !== callerID) {
    msg.channel.send("That nickname doesn't belong to you.").then().catch(console.error);
    return
  }

  msg.channel.send("Your nickname " + callerTag + " has been removed.").then().catch(console.error);
  client.channels.cache.get(consoleLogging).send("Discord user to be deleted: " + callerTag + " with id " + callerID);

  delete pseudoArray[callerTag];
  var proArray = JSON.stringify(pseudoArray);
  fs.writeFile('./dmUsers', proArray, console.error);
}
