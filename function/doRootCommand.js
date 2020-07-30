module.exports =

function doRootCommand(arguments, msg) {
  var newArgs = arguments.join(" ").toString();
  var newArguments = newArgs.split('"');
  var name = newArguments[1];
  var type = newArguments[2];
  client.user.setActivity(name, { type: type.replace(" ","") })
  client.channels.get(consoleLogging).send("I'm " + type.replace(" ","") + " " + name)
  msg.channel.send("Alright, switched! I'm " + type.replace(" ","") + " " + name).then().catch(console.error);
}
