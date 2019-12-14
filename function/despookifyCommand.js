module.exports =

function despookifyCommand(arguments, msg) {
  var fullCommand = msg.content.substr(4) // Remove Ougi's name
  var splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
  var primaryCommand = splitCommand[1] // The first word directly after Ougi's name is the command
  var arguments = splitCommand.slice(2) // All other words are arguments/parameters/options for the command

  if (arguments.length !== 1){
    msg.channel.send("Please provide a nickname you'd like to delete. Any characters (included emojis) are allowed but avoid spaces.");
    return
  }
  var pseudoArray = JSON.parse(fs.readFileSync('./dmUsers', 'utf-8', console.error));
  var callerTag = arguments[0];
  var callerID = msg.author.id;

  if (!pseudoArray.hasOwnProperty(callerTag)){
    msg.channel.send("Gomen'nasai but such spooky nickname doesn't exist.");
    return
  }
  if (pseudoArray[callerTag] !== callerID) {
    msg.channel.send("That nickname doesn't belong to you.");
    return
  }

  msg.channel.send("Your nickname " + callerTag + " has been removed.")
  console.log("Discord user to be deleted: " + callerTag + " with id " + callerID);

  delete pseudoArray[callerTag];
  var proArray = JSON.stringify(pseudoArray);
  fs.writeFile('./dmUsers', proArray, console.error);
}
