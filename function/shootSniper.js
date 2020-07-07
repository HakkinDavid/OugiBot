module.exports =

function shootSniper(arguments, msg) {
  var channelID = msg.channel.id;
  var pseudoArray = JSON.parse(fs.readFileSync('./aimAssist.txt', 'utf-8', console.error));

  if (!pseudoArray.includes(channelID)){
    var options = ["I ran out of ammo. Delete some messages in this channel in order to snipe them!", "Can't. There is nothing I can snipe from this channel.", "Sadly, no.", "The zone's clear.", "Oh frick. I missed the shot."];
    var response = options[Math.floor(Math.random()*options.length)];
    msg.channel.send(response).then().catch(console.error);
    return
  }
  var myAmmo = JSON.parse(fs.readFileSync('./ammo/' + channelID + '.txt', 'utf-8', console.error)).reverse();
  var maxIndex = myAmmo.length;
  var index = arguments * 1 - 1;

  if (isNaN(index)) {
    msg.channel.send("Uh, please provide a valid number (deleted messages are sorted from last to first) or leave it blank for fetching the last deleted message.").then().catch(console.error);
    return
  }

  if (index <= 0) {
    index = 0
  }

  var displayIndex = index + 1;
  if (displayIndex > maxIndex) {
    msg.channel.send("That's not a message index number yet.").then().catch(console.error);
    return
  }

  var bullet = myAmmo[index];

  var distance = Math.floor(Math.random()*300);
  var options = ["has been sniped by", "was eliminated by", "got shot by", "received a headshot from", "couldn't build a shelter to protect themselves from"];
  var action = options[Math.floor(Math.random()*options.length)];
  var embedColor = domColor(bullet.pfp, function(err, color){return color});

  if (msg.guild == null) {
    var footerLogo = client.user.avatarURL;
  }
  else {
    var footerLogo = msg.guild.iconURL;
  }

  var embed = new Discord.RichEmbed()
  .setAuthor(bullet.author + " " + action + " Ougi (" + distance + " m)", bullet.pfp)
  .setColor(embedColor)
  .setFooter("Originally sent at " + bullet.sent, footerLogo)
  if (bullet.text != "") {
    embed.addField("<:quote:730061725755375667>", bullet.text);
  }
  else {
    embed.addField("Oop-", "This message had no text. Support for media is coming soon!")
  }

  msg.channel.send({embed}).catch(console.error);
}
