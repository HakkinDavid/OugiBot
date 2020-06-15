module.exports =

function helpCommand(arguments, msg) {
    if (arguments == 'list' || arguments <= 0) {
        msg.channel.send("As of now, I can help you with these topics: `multiply`, `add`, `say`, `answer`, `now`, `image`, `embed`, `learn`, `translate`, `emoji`, `emoji-list`, `prefix` and `info`. Still improving! Try something like\n> ougi help info");
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
        msg.channel.send('Do you want to make some cool embeds? Try something like\n> ougi embed youtube.com/watch?v=dQw4w9WgXcQ `A nice idea for a marriage proposal` Check it out.', {embed: {
        color: 0000000,
        author: {
          name: msg.author.username,
          icon_url: msg.author.avatarURL
        },
        title: 'A nice idea for a marriage proposal',
        url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        description: 'Check it out.',
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "AstleyEmbed by Ougi"
        }
        }
      });
    } else if (arguments == 'learn') {
        msg.channel.send("Any cool ideas for commands or responses? Just provide a trigger phrase and a response, separated by two slashes `//`\n**Example:**\n> ougi learn what's up? // the sky\nAfterwards use it with my prefix (like `ougi what's up?`), or DM me (using my prefix for custom responses in DMs is optional).");
    } else if (arguments == 'translate') {
        var potentialPhrase = ["Hola, mi nombre es Ougi.", "こんにちわ、僕の名前はOugiだ。", "Yo no hablo español, sólo finjo hacerlo.", "No eres un Fortniter.", "¿Eres tonto o masticas agua?", "您好，我是Ougi。", "Hallo, ich heiße Ougi."];
        var phrase = potentialPhrase[Math.floor(Math.random()*potentialPhrase.length)];
        var langNames = {
          'ja': 'Japanese',
          'es': 'Spanish',
          'zh-CN': 'Chinese (Simplified)',
          'zh-TW': 'Chinese (Traditional)',
          'de': 'German'
        }
        translate(phrase, {to: "English"}).then(res => {
          var embed = new Discord.RichEmbed()
          .setTitle("Ougi Translate")
          .setColor("#6254E7")
          .addField("Input in " + langNames[res.from.language.iso], phrase)
          .addField("Translation to English", res.text)
          .setFooter("Translated by Ougi", client.user.avatarURL)
          .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/ougitranslate.png?raw=true");
          msg.channel.send("Is there anything I can translate for you? If so, just provide me a destination language (it can be the language's name or ISO code), followed by whatever you want me to translate.\n**Examples:** *(All of these have the same output.)*\n> ougi translate english " + phrase + "\n> ougi translate-english " + phrase + "\n> ougi translate en " + phrase + "\n> ougi translate-en " + phrase, {embed})
        }).catch(err => {
            console.error(err);
        });
    } else if (arguments == 'emoji-list') {
        msg.channel.send("Are you interested in knowing what emoji I can use? Use the following command to take a look.\n> ougi emoji-list\nYou can also specify a page number. Here's an example.\n> ougi emoji-list 2")
    } else if (arguments == 'emoji') {
        msg.channel.send("Oh yeah, I can send some cool custom emoji I was granted access to in the servers I'm in.\n**Example:**\n> ougi emoji nou\n<:nou:721293082716274719>\n**Peek at my list of emoji:**\n> ougi emoji-list");
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
