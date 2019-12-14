module.exports =

function embedCommand(arguments, msg) {
    if (arguments.length == 0){
      msg.channel.send("Do you need some help making an embed? Take a look at `help embed`.");
      return
    }
    var fullCommand = msg.content.substr(4); // Remove Ougi's name
    var splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
    var primaryCommand = splitCommand[1]; // The first word directly after Ougi's name is the command
    var arguments = splitCommand.slice(2); // All other words are arguments/parameters/options for the command
    var newArgs = arguments.join(" ").toString();
    var newArguments = newArgs.split('`');
    var url = arguments[0];
    var title = newArguments[1];
    var description = newArguments.slice(2);
    var colors = ["#00AE86"];
    var colorEmbed = colors[Math.floor(Math.random()*colors.length)];

    if (newArguments[2] == undefined){
      msg.channel.send("Remember to add an URL, to write your embed's title between these `` and to add a description.");
      return
    }

    if (!url.includes(".")) {
      msg.channel.send("That doesn't seem to be a site, so I can't create an embed for it. Make sure you add a Top Level Domain (e.g. \".com\", \".net\", \".boo\").")
      return
    }

    if (url.startsWith("http:")) {
      msg.channel.send("Sorry, but I won't make an embed for such an insecure site. Make sure it is \"https\", if it is then there's no need to add it, I'll do it for you.");
      return
    }

    if (!url.startsWith("https://")) {
      var url = "https://" + arguments[0];
    }

    msg.channel.send({embed: {
    color: 3447003,
    author: {
      name: msg.author.username,
      icon_url: msg.author.avatarURL
    },
    title: title,
    url: url,
    description: description.join("`").toString(),
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "SpookyEmbed by Ougi"
    }
    }
  }).then().catch(console.error);
  msg.delete().catch(O_o=>{});

}