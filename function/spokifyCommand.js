module.exports =

function spookifyCommand(arguments, msg) {
  var fullCommand = msg.content.substr(4) // Remove Ougi's name
  var splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
  var primaryCommand = splitCommand[1] // The first word directly after Ougi's name is the command
  var arguments = splitCommand.slice(2) // All other words are arguments/parameters/options for the command

  if (arguments.length !== 1){
    msg.channel.send("Please provide a nickname you'd like to be spokified as. Any characters (included emojis) are allowed but avoid spaces.");
    return
  }

  var pseudoArray = JSON.parse(fs.readFileSync('./dmUsers', 'utf-8', console.error));
  var callerTag = arguments[0];
  var callerID = msg.author.id;

  if (pseudoArray.hasOwnProperty(callerTag)){
    msg.channel.send("Gomen'nasai but that nickname is already in use.");
    return
  }

  var exists = whereIs(pseudoArray, callerID);

  if (exists == callerTag){
    msg.channel.send("Ah, hazukashī. Seems like you had been spokified before. Baka.");
    return
  }

  msg.channel.send("You'll be spookified as " + callerTag)
  console.log("Discord user to be added: " + callerTag + " with id " + callerID);

  pseudoArray[callerTag] = callerID;
  var proArray = JSON.stringify(pseudoArray);
  fs.writeFile('./dmUsers', proArray, console.error);
}
