module.exports =

function setLog(arguments, msg) {
  if (msg.channel.type != "text") {
    msg.channel.send("You must be in a server to run this command.");
    return
  }

  var elAdmin = msg.guild.ownerID;

  if (elAdmin != msg.author.id) {
    msg.channel.send("You must be the server's owner to run this command.");
    return
  }

  var pseudoArray = JSON.parse(fs.readFileSync('./guildNews.txt', 'utf-8', console.error));
  var guildID = msg.guild.id;
  var guildNews = msg.channel.id;

  if (arguments.length < 0) {
    if (arguments[0] == "disable") {
      if (pseudoArray.hasOwnProperty(guildID)){
        delete pseudoArray[guildID];
        msg.channel.send("Newsletter channel successfully disabled.");
        var proArray = JSON.stringify(pseudoArray);
        fs.writeFile('./guildNews.txt', proArray, console.error);
        var myNewspaper = './guildNews.txt';
        ougi.backup(myNewspaper, guildNewsChannel);
        return
      }
      else {
        msg.channel.send("There was no newsletter channel set.");
        return
      }
    }
    else if (arguments[0].startsWith("<#") && arguments[0].endsWith(">")) {
      var channelMention = arguments[0];
      channelMention = channelMention.slice(2, -1);
      if (!msg.guild.channels.has(channelMention)) {
        msg.channel.send("Huh? Looks like you're using this command wrong. Refer to the following command for help.\n> ougi help setnews");
        return
      }
      guildNews = channelMention;
    }
    else {
      msg.channel.send("Huh? Looks like you're using this command wrong. Refer to the following command for help.\n> ougi help setnews");
      return
    }
  }

  msg.channel.send("I'll start sending updates and related information into <#"+ guildNews +">.");

  pseudoArray[guildID] = guildNews;
  var proArray = JSON.stringify(pseudoArray);
  fs.writeFile('./guildNews.txt', proArray, console.error);
  var myNewspaper = './guildNews.txt';
  ougi.backup(myNewspaper, guildNewsChannel);
}
