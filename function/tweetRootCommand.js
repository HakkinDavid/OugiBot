module.exports =

function (msg) {
    var plsTweetThis = msg.content.slice(11);
    while (plsTweetThis.includes('  ')) {
      plsTweetThis = plsTweetThis.replace('  ', ' ')
    }
    T.post('statuses/update', { status: plsTweetThis }, function(err, data, response) {
      client.channels.get(consoleLogging).send("Tweeted: " + plsTweetThis)
    })
    msg.channel.send("**Tweeted:** " + plsTweetThis)
}
