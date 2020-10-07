module.exports =

function (channelID) {
  if (client.channels.cache.get(channelID) == undefined) {
    console.log("Couldn't retrieve database content from " + channelID);
  }
  client.channels.cache.get(channelID).messages.fetch({ limit: 1 }).then(
    messages => {
      let lastMessage = messages.first();
      download(lastMessage.attachments.first().url)
      console.log("Retrieved database object at " + lastMessage.attachments.first().url);
    }
  ).catch(console.error);
}
