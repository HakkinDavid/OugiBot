module.exports =

function learn(arguments, msg) {
  var thisMessage = arguments.join(" ");
  var breakChocolate = thisMessage.split("//");
  if (breakChocolate.length !== 2){
    msg.channel.send("Please provide a trigger phrase and a response, separated by two slashes `//`\n**Example:**\n```ougi learn what's up? // the sky```");
    return
  }

  var trigger = breakChocolate[0].toString();
  var response = breakChocolate[1].toString();

  if (trigger.endsWith(" ")){
    
  }

  var pseudoArray = JSON.parse(fs.readFileSync('./dmUsers', 'utf-8', console.error));
  var callerTag = arguments[0];
  var callerID = msg.author.id;

  if (pseudoArray.hasOwnProperty(callerTag)){
    msg.channel.send("Gomen'nasai but that nickname is already in use.");
    return
  }

  var exists = ougi.whereIs(pseudoArray, callerID);

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
