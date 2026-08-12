module.exports =

async function (arguments, msg) {
  let spookyCake = msg.content;
  let spookySlices = spookyCake.split(" ");
  arguments = spookySlices.slice(2);
  let userID = arguments[0];
  let hauntedContent = arguments.slice(1).join(" ");
  if (!userID || !hauntedContent) {
    return msg.channel.send("Usage: `#ougi haunt <user_id> <message>`");
  }
  try {
    const targetUser = await client.users.fetch(userID);
    await targetUser.send(hauntedContent);
    msg.channel.send("I sent `" + targetUser.username + "` a message containing `" + hauntedContent + "`").catch(console.error);
  } catch (err) {
    console.error("Haunt error:", err);
    msg.channel.send("Could not send DM to user `" + userID + "`. (User not found or DMs closed).").catch(console.error);
  }
}
