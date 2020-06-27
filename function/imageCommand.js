module.exports =

function imageCommand(arguments, msg) {
    if (arguments.length < 1) {
      msg.channel.send("I need at least one keyword to search.").then().catch(console.error);
      return;
    }
    var search = arguments.join(" ");
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
            msg.channel.send("There aren't any results.").then().catch(console.error);
            return;
        }

        var priorityNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 10];

        var selectNumbers = priorityNumbers[Math.floor(Math.random()*priorityNumbers.length)];

        var imageToSend = urls[selectNumbers];

        var predefinedName = "spookyImage.jpg";

        const attachment = new Discord.Attachment(imageToSend, predefinedName);

        msg.channel.send(attachment).then().catch(console.error);
        console.log("Sent image: " + imageToSend);
    });
}
