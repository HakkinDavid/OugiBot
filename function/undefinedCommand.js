module.exports =

function undefinedCommand(arguments, msg) {
  var options = ["I don't get it.", "What do you mean?", "Baka.", "Oh.", "Nani", "Nande"];
  var response = options[Math.floor(Math.random()*options.length)];
  msg.channel.send(response).then().catch(console.error);
  console.log("I'm clueless... **Replied**\n> " + response);
  return
}
