module.exports =

async function (arguments, msg, isEdit) {
  let channelID = msg.channel.id;
  let responseKeys = ["snipe_noAmmo1", "snipe_noAmmo2", "snipe_noAmmo3", "snipe_noAmmo4", "snipe_noAmmo5"];

  if (ammo[channelID] == undefined && !isEdit || reloadedAmmo[channelID] == undefined && isEdit) {
    const randomKey = responseKeys[Math.floor(Math.random() * responseKeys.length)];
    msg.channel.send(await ougi.text({ msg, stringID: randomKey }));
    return;
  }

  let myAmmo = ammo[channelID];
  if (isEdit) {
    myAmmo = reloadedAmmo[channelID];
  }
  let maxIndex = myAmmo.length;
  let index = arguments * 1 - 1;

  if (isNaN(index)) {
    msg.channel.send(await ougi.text({ msg, stringID: "snipe_invalidNumber" })).catch(console.error);
    return;
  }

  if (index <= 0) {
    index = 0;
  }

  let displayIndex = index + 1;
  if (displayIndex > maxIndex) {
    msg.channel.send(await ougi.text({ msg, stringID: "snipe_indexOutOfRange" })).catch(console.error);
    return;
  }

  let bullet = myAmmo[index];

  let distance = Math.floor(Math.random()*300);
  let options = ["has sniped", "eliminated", "shot", "blew", "caused fall damage to"];
  let action = options[Math.floor(Math.random()*options.length)];
  let snipers = ["a Bolt-Action Sniper Rifle", "a Semi-Automatic Sniper Rifle", "a Hunting Rifle", "a Heavy Sniper Rifle", "an Automatic Sniper Rifle", "a Storm Scout Sniper Rifle"];
  let snipedWith = snipers[Math.floor(Math.random()*snipers.length)];
  let kindOfRare = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
  let rarity = kindOfRare[Math.floor(Math.random()*kindOfRare.length)];
  let footerLogo;

  if (msg.guild == null) {
    footerLogo = client.user.avatarURL({dynamic: true, size: 4096});
  }
  else {
    footerLogo = msg.guild.iconURL();
  }

  const renderedFooter = await ougi.text({
    msg,
    stringID: "snipe_footerFormat",
    values: {
      action,
      author: bullet.author,
      distance,
      weapon: snipedWith,
      rarity,
      maxIndex
    }
  });

  let embed = new Discord.EmbedBuilder()
  .setColor("#7F0037")
  .setAuthor({name: "Ougi [BOT]", icon: client.user.avatarURL({dynamic: true, size: 4096})})
  .setThumbnail(bullet.pfp)
  .setFooter({text: renderedFooter, icon: footerLogo});
  if (bullet.text != "") {
    const fieldHeader = (await ougi.text({
      msg,
      stringID: "snipe_said",
      values: {
        author: bullet.author
      }
    })) + " <:quote:730061725755375667>";
    if (bullet.text.length < 1024) {
      embed.addFields({name: fieldHeader, value: bullet.text});
    }
    else {
      embed.addFields({name: fieldHeader, value: bullet.text.slice(0, 1024)});
      embed.addFields({name: "\u200b", value: bullet.text.slice(1024)});
    }
  }
  else {
    embed.addFields({name: bullet.author + " shared a file", value: "\u200b"})
  }

  if (bullet.files.length > 0) {
    embed.addFields({name: bullet.files[0].name, value: "[Click here to view it on your browser](" + bullet.files[0].url + ")"});
    embed.setImage(bullet.files[0].url);
  }

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
