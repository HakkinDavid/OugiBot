module.exports =

async function (arguments, msg) {
  var channelID = msg.channel.id;
  var options = ["I ran out of ammo. Delete some messages in this channel in order to snipe them!", "Can't. There is nothing I can snipe from this channel.", "Sadly, no.", "The zone's clear.", "Oh frick. I missed the shot."];
  var response = options[Math.floor(Math.random()*options.length)];

  if (!fs.existsSync('./ammo/' + channelID + '.txt')){
    msg.channel.send(response).catch(console.error);
    return
  }
  if (fs.readFileSync('./ammo/' + channelID + '.txt', 'utf-8', console.error) != "") {
    var myAmmo = JSON.parse(fs.readFileSync('./ammo/' + channelID + '.txt', 'utf-8', console.error)).reverse();
  }
  else {
    msg.channel.send(response).catch(console.error);
    return
  }
  var maxIndex = myAmmo.length;
  var index = arguments * 1 - 1;

  if (isNaN(index)) {
    msg.channel.send("Uh, please provide a valid number (deleted messages are sorted from last to first) or leave it blank for fetching the last deleted message.").catch(console.error);
    return
  }

  if (index <= 0) {
    index = 0
  }

  var displayIndex = index + 1;
  if (displayIndex > maxIndex) {
    msg.channel.send("That's not a message index number yet.").catch(console.error);
    return
  }

  var bullet = myAmmo[index];

  var distance = Math.floor(Math.random()*300);
  var options = ["has sniped", "eliminated", "shot", "blew", "caused fall damage to"];
  var action = options[Math.floor(Math.random()*options.length)];
  var snipers = ["a Bolt-Action Sniper Rifle", "a Semi-Automatic Sniper Rifle", "a Hunting Rifle", "a Heavy Sniper Rifle", "an Automatic Sniper Rifle", "a Storm Scout Sniper Rifle"];
  var snipedWith = snipers[Math.floor(Math.random()*snipers.length)];
  var kindOfRare = ["Common", "Uncommon", "Rare", "Epic", "Legendary"]
  var rarity = kindOfRare[Math.floor(Math.random()*kindOfRare.length)];

  if (msg.guild == null) {
    var footerLogo = client.user.avatarURL();
  }
  else {
    var footerLogo = msg.guild.iconURL();
  }

  let embed = new Discord.MessageEmbed()
  .setColor("#7F0037")
  .setAuthor("Ougi [BOT]", client.user.avatarURL())
  .setThumbnail(bullet.pfp)
  .setFooter("Ougi " + action + " " + bullet.author + " (" + distance + " m)" + " with " + snipedWith + " (" + rarity + "). This channel has " + maxIndex + " snipeable messages.", footerLogo);
  if (bullet.text != "") {
    if (bullet.text.length < 1024) {
      embed.addField(bullet.author + " said <:quote:730061725755375667>", bullet.text)
    }
    else {
      embed.addField(bullet.author + " said <:quote:730061725755375667>", bullet.text.slice(0, 1024))
      embed.addField("\u200B", bullet.text.slice(1024))
    }
  }
  else {
    embed.addField("Oop-", "This message had no text. Support for media is coming soon!")
  }

  msg.channel.send({embed}).catch(console.error);
}
