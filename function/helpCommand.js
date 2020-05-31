module.exports =

function helpCommand(arguments, msg) {
    if (arguments == 'list' || arguments <= 0) {
        msg.channel.send("As of now, I can help you with these topics: `multiply`, `add`, `say`, `answer`, `now`, `image`, `embed`, `learn`, `prefix` and `info`. Still improving! Try something like\n> ougi help info");
    } else if (arguments == 'multiply') {
        msg.channel.send("I'll gladly multiply the numbers you provide me as long you input more than two values, and only if you promise me to study math.\n> ougi multiply [value] [value] ...");
    } else if (arguments == 'add') {
        msg.channel.send("I'll do additions for you! Try\n> ougi add [value] [value] ...");
    } else if (arguments == 'say') {
        msg.channel.send("Do you want me to say something? Try\n> ougi say [message]");
    } else if (arguments == 'answer') {
        msg.channel.send("Are you curious about my opinion? Try\n> ougi answer [question]");
    } else if (arguments == 'now') {
        msg.channel.send("If you want to know how I'm feeling or what I'm doing, just do \n> ougi now");
    } else if (arguments == 'image') {
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
                msg.channel.send("There aren't any results.")
                return;
            }

            var priorityNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 10];

            var selectNumbers = priorityNumbers[Math.floor(Math.random()*priorityNumbers.length)];

            var imageToSend = urls[selectNumbers];

            var predefinedName = "spookyImage.jpg";

            const attachment = new Discord.Attachment(imageToSend, predefinedName);
            msg.channel.send("I'll get you a nice image based on whatever you want me to search in Google. Here's an example:\n> ougi image " + search, attachment).then().catch(console.error);
          });
    } else if (arguments == 'embed') {
        msg.channel.send('Do you want to make some cool embeds? Try something like\n> ougi embed youtube.com/watch?v=dQw4w9WgXcQ `A nice idea for a marriage proposal` Check it out.');
    } else if (arguments == 'learn') {
        msg.channel.send("Any cool ideas for commands or responses? Just provide a trigger phrase and a response, separated by two slashes `//`\n**Example:**\n> ougi learn what's up? // the sky\nAfterwards use it with my prefix (like `ougi what's up?`), or DM me (using my prefix for custom responses in DMs is optional).");
    } else if (arguments == 'prefix') {
        msg.channel.send("Just call me by my name!\n> ougi");
    } else if (arguments == 'info') {
        ougi.whoIsMe(arguments, msg)
    } else {
        var options = ["Be specific, please. Try asking me for help and a topic. A good start would be\n> ougi help", "Do you need help? Try\n> ougi help", "Is there anything I could help you with?\n> ougi help"];
        var response = options[Math.floor(Math.random()*options.length)];
        msg.channel.send(response).then().catch(console.error);
    }
}
