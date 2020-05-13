module.exports =
function aTweet() {
  var iSaid = client.channels.get(wordsChannel).fetchMessages({ limit: 1 }).then(messages => {
    var store = messages.first();
    var willSay = store * 1;
    console.log("Going to tweet word number: " + willSay);
    var pseudoEnglish = JSON.parse(fs.readFileSync('./spookyWords', 'utf-8', console.error));
    var pick = ["have", "homies", "is this"];
    var action = pick[Math.floor(Math.random()*pick.length)];

    if (action == "have") {
      var options = ["it spooky", "it bad at fortnite", "it has me", "i want more of it", "it better than ninja", "it good", "help", "quieres¿", "it be menacing", "it be sad", "say sike", "it an all-star", "it a rockstar", "it no stranger to love", "it knows the rules and so do i", "it didn't make sense not to live for fun", "it brain got smart but it head got dumb", "it much to do, so much to see", "it spooky", "it wrong to take the backstreets", "it never knows if it does not go", "it never shines but it glows", "heee heee", "ayuwoki", "it ok", "it comes alive in midnight", "it can make a promise", "it can make a change", "it can make the difference", "it needs friends", "it tall", "it smol", "it says u bad at fortnite", "i achieved comedy", "all my homies"];
      var response = options[Math.floor(Math.random()*options.length)];
      var contentToSay = "i have " + pseudoEnglish[willSay] + "\n" + response;
    }
    else if (action == "homies") {
      var theHomies = ["love", "hate", "got", "play with", "use", "watch", "eat", "follow", "unfollowed", "believe in", "invented", "dance to", "listen to"];
      var chooseHomie = theHomies[Math.floor(Math.random()*theHomies.length)];
      var contentToSay = "i " + chooseHomie + " " + pseudoEnglish[willSay] + "\n" + "all my homies " + chooseHomie + " " + pseudoEnglish[willSay];
    }
    else if (action == "is this") {
      request(settings, function(error, response, responseBody) {
          var willNotSay = willSay + 1;
          var search = pseudoEnglish[willNotSay];
          var settings = {
              url: "http://results.dogpile.com/serp?qc=images&q=" + search,
              method: "GET",
              headers: {
                  "Accept": "text/html",
                  "User-Agent": "Chrome"
              }
          };
          if (error) {
              return;
          }

          $ = cheerio.load(responseBody);

          var links = $(".image a.link");

          var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));

          if (!urls.length) {
              console.log('ERROR: There was no results for my tweet\'s image');
              return;
          }

          var imageToSend = urls[1];

          var tFileName = "twitterupload.png"

          download(imageToSend, tFileName);

          var contentToSay = "is this " + pseudoEnglish[willSay] + "?";

          var b64content = fs.readFileSync('./twitterupload.png', { encoding: 'base64' });

          T.post('media/upload', { media_data: b64content }, function (err, data, response) {
          var mediaIdStr = data.media_id_string
          var altText = pseudoEnglish[willSay];
          var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

            T.post('media/metadata/create', meta_params, function (err, data, response) {
              if (!err) {
                var params = { status: contentToSay, media_ids: [mediaIdStr] }

                T.post('statuses/update', params, function (err, data, response) {
                  console.log("Tweeted: " + contentToSay)
                })
              }
            })
          })
      });
    }
    store.channel.send(willSay + 1);
    return;
    else {
      var contentToSay = "the game"
    }
    T.post('statuses/update', { status: contentToSay }, function(err, data, response) {
      console.log("Tweeted: " + contentToSay)
    })
    store.channel.send(willSay + 1)
  });
}
