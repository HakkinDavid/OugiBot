module.exports =

function helpCommand(arguments, msg) {
    if (arguments == 'list' || arguments <= 0) {
        msg.channel.send("As of now, I can help you with these topics: `multiply`, `add`, `say`, `answer`, `now`, `image`, `embed`, `learn`, `translate`, `prefix` and `info`. Still improving! Try something like\n> ougi help info");
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
    } else if (arguments.join(" ") == 'emoji list' || arguments.join(" ") == 'emoji list 1') {
        var emojiIDList = client.emojis.map((e) => e.toString());
        var field1 = emojiIDList.slice(0, 23).join(" ");
        var field2 = emojiIDList.slice(23, 46).join(" ");
        var field3 = emojiIDList.slice(46, 69).join(" ");
        var field4 = emojiIDList.slice(69, 92).join(" ");
        var field5 = emojiIDList.slice(92, 115).join(" ");
        var field6 = emojiIDList.slice(115, 138).join(" ");
        var field7 = emojiIDList.slice(138, 161).join(" ");
        var embed = new Discord.RichEmbed()
        .setTitle("SpookyEmoji List")
        .setColor("#C93A57")
        .addField("Emoji Set 1", field1)
        .addField("Emoji Set 2", field2)
        .addField("Emoji Set 3", field3)
        .addField("Emoji Set 4", field4)
        .addField("Emoji Set 5", field5)
        .addField("Emoji Set 6", field6)
        .addField("Emoji Set 7", field7)
        .setFooter("SpookyEmoji List by Ougi [Page 1]", client.user.avatarURL);
        msg.channel.send("These are the emoji I can currently use.\nYou can also browse by page. **Example:**\n> ougi emoji list 1", {embed});
    } else if (arguments.join(" ") == 'emoji list 2') {
        var emojiIDList = client.emojis.map((e) => e.toString());
        var field8 = emojiIDList.slice(161, 184).join(" ");
        var field9 = emojiIDList.slice(184, 207).join(" ");
        var field10 = emojiIDList.slice(207, 230).join(" ");
        var field11 = emojiIDList.slice(230, 253).join(" ");
        var field12 = emojiIDList.slice(253, 276).join(" ");
        var field13 = emojiIDList.slice(276, 299).join(" ");
        var field14 = emojiIDList.slice(299, 322).join(" ");
        var embed = new Discord.RichEmbed()
        .setTitle("SpookyEmoji List")
        .setColor("#933AC9")
        .addField("Emoji Set 8", field8)
        .addField("Emoji Set 9", field9)
        .addField("Emoji Set 10", field10)
        .addField("Emoji Set 11", field11)
        .addField("Emoji Set 12", field12)
        .addField("Emoji Set 13", field13)
        .addField("Emoji Set 14", field14)
        .setFooter("SpookyEmoji List by Ougi [Page 2]", client.user.avatarURL);
        msg.channel.send("These are the emoji I can currently use.\nYou can also browse by page. **Example:**\n> ougi emoji list 2", {embed});
    } else if (arguments.join(" ") == 'emoji list 3') {
        var emojiIDList = client.emojis.map((e) => e.toString());
        var field15 = emojiIDList.slice(322, 345).join(" ");
        var field16 = emojiIDList.slice(345, 368).join(" ");
        var field17 = emojiIDList.slice(368, 391).join(" ");
        var field18 = emojiIDList.slice(391, 410).join(" ");
        var field19 = emojiIDList.slice(410, 430).join(" ");
        var field20 = emojiIDList.slice(430, 453).join(" ");
        var field21 = emojiIDList.slice(453, 476).join(" ");
        var embed = new Discord.RichEmbed()
        .setTitle("SpookyEmoji List")
        .setColor("#4AB5AA")
        .addField("Emoji Set 15", field15)
        .addField("Emoji Set 16", field16)
        .addField("Emoji Set 17", field17)
        .addField("Emoji Set 18", field18)
        .addField("Emoji Set 19", field19)
        .addField("Emoji Set 20", field20)
        .addField("Emoji Set 21", field21)
        .setFooter("SpookyEmoji List by Ougi [Page 3]", client.user.avatarURL);
        msg.channel.send("These are the emoji I can currently use.\nYou can also browse by page. **Example:**\n> ougi emoji list 3", {embed});
    } else if (arguments == 'emoji') {
        msg.channel.send("Oh yeah, I can send some cool custom emoji I was granted access to in the servers I'm in.\n**Example:**\n> ougi emoji nou\n<:nou:721293082716274719>\n**Peek at my list of emoji:**\n> ougi help emoji list");
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
