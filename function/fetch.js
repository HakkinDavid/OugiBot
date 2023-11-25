module.exports =

async function (channelID) {
  if (client.channels.cache.get(channelID) == undefined) {
    console.log("Couldn't retrieve database content from " + channelID);
  }
  client.channels.cache.get(channelID).messages.fetch({ limit: 1 }).then(
    async (messages) => {
      let lastMessage = messages.first();
      let myURL = lastMessage.attachments.first().url.replace(/\?[^\?]+$/gi, '');
      await download(myURL)
      console.log("Retrieved database object at " + myURL);
    }
  ).catch(console.error);
}
