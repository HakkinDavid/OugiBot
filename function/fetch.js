module.exports =

function (channelID) {
  var whereToFetch = client.channels.cache.get(channelID).messages.fetch({ limit: 1 }).then(messages => { var lastMessage = messages.first(); download(lastMessage.attachments.first().url); });
}
