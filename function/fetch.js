module.exports =

function (channelID) {
  var whereToFetch = client.channels.get(channelID).fetchMessages({ limit: 1 }).then(messages => { var lastMessage = messages.first(); download(lastMessage.attachments.first().url); });
}
