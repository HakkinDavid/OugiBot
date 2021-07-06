module.exports =

function (arguments, msg, isEdit) {
  let channelID = msg.channel.id;
  let response = ["I ran out of ammo. Delete or edit some messages in this channel in order to snipe them!", "Can't. There is nothing I can snipe from this channel.", "Sadly, no.", "The zone's clear.", "Oh frick. I missed the shot."];

  if (ammo[channelID] == undefined && !isEdit || reloadedAmmo[channelID] == undefined && isEdit) {
    msg.channel.send(response[Math.floor(Math.random()*response.length)]);
    return
  }

  let myAmmo = ammo[channelID];
  if (isEdit) {
    myAmmo = reloadedAmmo[channelID];
  }
  let maxIndex = myAmmo.length;
  let index = arguments * 1 - 1;

  if (isNaN(index)) {
    msg.channel.send("Uh, please provide a valid number (deleted messages are sorted from last to first) or leave it blank for fetching the last deleted message.").catch(console.error);
    return
  }

  if (index <= 0) {
    index = 0
  }

  let displayIndex = index + 1;
  if (displayIndex > maxIndex) {
    msg.channel.send("That's not a message index number yet.").catch(console.error);
    return
  }

  let bullet = myAmmo[index];

  let distance = Math.floor(Math.random()*300);
  let options = ["has sniped", "eliminated", "shot", "blew", "caused fall damage to"];
  let action = options[Math.floor(Math.random()*options.length)];
  let snipers = ["a Bolt-Action Sniper Rifle", "a Semi-Automatic Sniper Rifle", "a Hunting Rifle", "a Heavy Sniper Rifle", "an Automatic Sniper Rifle", "a Storm Scout Sniper Rifle"];
  let snipedWith = snipers[Math.floor(Math.random()*snipers.length)];
  let kindOfRare = ["Common", "Uncommon", "Rare", "Epic", "Legendary"]
  let rarity = kindOfRare[Math.floor(Math.random()*kindOfRare.length)];
  let footerLogo;

  if (msg.guild == null) {
    footerLogo = client.user.avatarURL();
  }
  else {
    footerLogo = msg.guild.iconURL();
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
