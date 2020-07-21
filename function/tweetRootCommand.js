module.exports =

function tweetRootCommand(msg) {
    var plsTweetThis = msg.content.slice(11);
    while (plsTweetThis.includes('  ')) {
      plsTweetThis = plsTweetThis.replace('  ', ' ')
    }
    T.post('statuses/update', { status: plsTweetThis }, function(err, data, response) {
      console.log("Tweeted: " + plsTweetThis)
    })
}
