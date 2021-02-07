module.exports =

function(msg) {
  /*-----------------------------------*/
  while (msg.content.includes('  ')) {
    msg.content = msg.content.replace('  ', ' ')
  }
  while (msg.content.includes('\n\n')) {
    msg.content = msg.content.replace('\n\n', '\n')
  }
  let spookyCake = msg.content;
  let spookySlices = spookyCake.split(" ");
  let spookyCommand = spookySlices[1];
  var arguments = spookySlices.slice(2);
  /*-----------------------------------*/
  let ghostTweet = new Discord.MessageEmbed()
    .setColor("#00acee")
    .setTimestamp()
    .setFooter("Twitter", "https://github.com/HakkinDavid/OugiBot/blob/master/images/twittericon.png?raw=true");
  if (arguments.length < 1) {
    msg.channel.send("Tweet must not be empty.");
    return
  }
  if (arguments[0].startsWith("<@") && arguments[0].endsWith(">")) {
    let mentionedUser = arguments[0].slice(2, arguments[0].length-1).replace("!", "");
    if (!client.users.cache.has(mentionedUser)) {
      msg.channel.send("Author name must be a valid user mention.");
      return
    }
    ghostTweet.setAuthor(client.users.cache.get(mentionedUser).username + " (@" + client.users.cache.get(mentionedUser).username + ")", client.users.cache.get(mentionedUser).avatarURL());
    arguments.shift();
  }
  else {
    ghostTweet.setAuthor(msg.author.username + " (@" + msg.author.username + ")", msg.author.avatarURL());
  }
  ghostTweet.setDescription(arguments.join(" ").slice(0, 2048));
  msg.delete().catch(O_o=>{});
  msg.channel.send(ghostTweet).catch(console.error);
}
