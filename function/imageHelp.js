module.exports =

async function (msg) {
  var keywords = ["cute kitties", "cute puppies", "rick astley"];
  var search = keywords[Math.floor(Math.random()*keywords.length)];
  var options = {
      url: "http://results.dogpile.com/serp?qc=images&q=" + search,
      method: "GET",
      headers: {
          "Accept": "text/html",
          "User-Agent": "Chrome"
      }
  };
  request(options, function(error, response, responseBody) {
      if (error) {
          return;
      }

      $ = cheerio.load(responseBody);

      var links = $(".image a.link");

      var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));

      if (!urls.length) {
          msg.channel.send("There aren't any results.").catch(console.error);
          return;
      }

      var priorityNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 10];

      var selectNumbers = priorityNumbers[Math.floor(Math.random()*priorityNumbers.length)];

      var imageToSend = urls[selectNumbers];

      var predefinedName = "spookyImage.jpg";

      const attachment = new Discord.MessageAttachment(imageToSend, predefinedName);
      msg.channel.send("I'll get you a nice image based on whatever you want me to search in Google. Here's an example:\n> ougi image " + search, attachment).catch(console.error);
    });
}
