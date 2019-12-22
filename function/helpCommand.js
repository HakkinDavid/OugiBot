module.exports =

function helpCommand(arguments, msg) {
    if (arguments == 'list') {
        msg.channel.send("As of now, I can help you with these topics: `multiply`, `add`, `say`, `answer`, `now`, `image`, `embed`, `prefix` and `info`. Still improving!");
    } else if (arguments == 'multiply') {
        msg.channel.send("I'll gladly multiply the numbers you provide me as long you input more than two values, and only if you promise me to study math: `multiply [value] [value] ...`.");
    } else if (arguments == 'add') {
        msg.channel.send("I'll do additions for you! Ask *me* to `add [value] [value] ...`.");
    } else if (arguments == 'say') {
        msg.channel.send("Do you want me to say something? Just ask *me* to `say [message]`.");
    } else if (arguments == 'answer') {
        msg.channel.send("Are you curious about my opinion? Ask *me* to `answer [question]`.");
    } else if (arguments == 'now') {
        msg.channel.send("If you want to know how I'm feeling or what I'm doing, just tell *me* `now`");
    } else if (arguments == 'image'){
        const attachment = new Discord.Attachment("./images/imagehelp.png");
        msg.channel.send(attachment).then().catch(console.error);
    } else if (arguments == 'embed'){
        msg.channel.send('Do you want to make some cool embeds? Try asking *me* ```embed [url] `[title]` [description]```');
    } else if (arguments == 'prefix') {
        msg.channel.send("Just call me by my name!");
    } else if (arguments == 'info') {
        ougi.whoIsMe(arguments, msg)
    } else if (arguments.length < 1) {
        var options = ["Could you be more specific? Try asking *me* for `help [topic]`. A good start would be `help list`.", "Do you need help? Try asking *me* for `help [topic]`. As an example, use `help list`.", "Is there anything I could help you with? Ask *me* for `help [topic]`. You could try `help list`."];
        var response = options[Math.floor(Math.random()*options.length)];
        msg.channel.send(response).then().catch(console.error);
    }
    else {
      var options = ["I don't get it.", "What do you mean?", "Word it right, baka."];
      var response = options[Math.floor(Math.random()*options.length)];
      msg.channel.send(response).then().catch(console.error);
    }
}
