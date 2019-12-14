module.exports =

function statusRootCommand(arguments, msg) {
  var status = arguments[0];
  client.user.setStatus(status).then().catch(console.error);
  console.log("Now I'm " + status.replace("dnd", "in Do Not Disturb mode"));
  msg.channel.send("Now I'm " + status.replace("dnd", "in Do Not Disturb mode"));
}
