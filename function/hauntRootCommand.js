module.exports =

async function (arguments, msg) {
  let spookyCake = msg.content;
  let spookySlices = spookyCake.split(" ");
  arguments = spookySlices.slice(2);
  let userID = arguments[0];
  let hauntedContent = arguments.slice(1).join(" ");
  if (!userID || !hauntedContent) {
    return msg.channel.send(await ougi.text({ lang: 'en', stringID: "root_hauntUsage" }));
  }
  try {
    const targetUser = await client.users.fetch(userID);
    await targetUser.send(hauntedContent);
    const sentMsg = await ougi.text({
      lang: 'en',
      stringID: "root_hauntSuccess",
      values: {
        user: targetUser.username,
        message: hauntedContent
      }
    });
    msg.channel.send(sentMsg).catch(console.error);
  } catch (err) {
    console.error("Haunt error:", err);
    const failMsg = await ougi.text({
      lang: 'en',
      stringID: "root_hauntFail",
      values: {
        id: userID
      }
    });
    msg.channel.send(failMsg).catch(console.error);
  }
}
