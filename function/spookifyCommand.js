module.exports =

function (arguments, msg) {
  var spookyCake = msg.content;
  var spookySlices = spookyCake.replace("\n", " ").split(" ");
  var spookyCommand = spookySlices[1];
  var arguments = spookySlices.slice(2);

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

  var exists = ougi.whereIs(pseudoArray, callerID);

  if (exists == callerTag){
    msg.channel.send("Ah, hazukashī. Seems like you had been spokified before. Baka.");
    return
  }

  msg.channel.send("You'll be spookified as " + callerTag)
  client.channels.cache.get(consoleLogging).send("Discord user to be added: " + callerTag + " with id " + callerID);

  pseudoArray[callerTag] = callerID;
  var proArray = JSON.stringify(pseudoArray);
  fs.writeFile('./dmUsers', proArray, console.error);
}
