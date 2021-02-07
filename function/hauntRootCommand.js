module.exports =

async function (arguments, msg) {
  var userID = arguments[0];
  var hauntedContent = arguments.slice(1).join(" ");
  client.users.cache.get(userID).send(hauntedContent).catch(console.error);
  msg.channel.send("I sent `" + client.users.cache.get(userID).tag + "` a message containing `" + hauntedContent + "`").catch(console.error);
}
