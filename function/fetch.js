module.exports =

async function (channelID) {
  if (client.channels.cache.get(channelID) == undefined) {
    console.log("Couldn't retrieve database content from " + channelID);
  }
  client.channels.cache.get(channelID).messages.fetch({ limit: 1 }).then(
    async (messages) => {
      let lastMessage = messages.first();
      await download(lastMessage.attachments.first().url)
      console.log("Retrieved database object at " + lastMessage.attachments.first().url);
    }
  ).catch(console.error);
}
