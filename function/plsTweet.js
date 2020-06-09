module.exports =

function plsTweet(arguments, msg) {
    var plsTweetThis = arguments.join(' ');
    while (plsTweetThis.includes('  ')) {
      plsTweetThis = plsTweetThis.replace('  ', ' ')
    }
    T.post('statuses/update', { status: plsTweetThis }, function(err, data, response) {
      console.log("Tweeted: " + plsTweetThis)
    })
}
