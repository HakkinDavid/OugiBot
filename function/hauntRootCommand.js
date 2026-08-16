module.exports =

async function (arguments, msg) {
  let spookyCake = msg.content;
  let spookySlices = spookyCake.split(" ");
  arguments = spookySlices.slice(2);
  let userID = arguments[0];
  let hauntedContent = arguments.slice(1).join(" ");
  if (!userID || !hauntedContent) {
    return msg.channel.send(await ougi.text('en', "root_hauntUsage"));
  }
  try {
    const targetUser = await client.users.fetch(userID);
    await targetUser.send(hauntedContent);
    const sentMsg = (await ougi.text('en', "root_hauntSuccess"))
      .replace(/{user}/g, targetUser.username)
      .replace(/{message}/g, hauntedContent);
    msg.channel.send(sentMsg).catch(console.error);
  } catch (err) {
    console.error("Haunt error:", err);
    const failMsg = (await ougi.text('en', "root_hauntFail")).replace(/{id}/g, userID);
    msg.channel.send(failMsg).catch(console.error);
  }
}
