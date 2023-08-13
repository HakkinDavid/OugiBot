module.exports =

async function (arguments, msg) {
  let spookyCake = msg.content;
  let spookySlices = spookyCake.split(" ");
  arguments = spookySlices.slice(2);
  let userID = arguments[0];
  let hauntedContent = arguments.slice(1).join(" ");
  client.users.cache.get(userID).send(hauntedContent).catch(console.error);
  msg.channel.send("I sent `" + client.users.cache.get(userID).username + "` a message containing `" + hauntedContent + "`").catch(console.error);
}
