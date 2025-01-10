module.exports =

async function (msg) {
  let thisOBJ, titleCurl, mentioned, curlType, memberCurl, iconCurl;
  let colorCurl = "#43B581";
  if (msg.mentions.users.first() !== undefined) {
    mentioned = msg.mentions.users.first();
    thisOBJ = await client.users.fetch(mentioned.id);
    if (thisOBJ === undefined) {
      msg.channel.send("User couldn't be fetched. Do they share a Discord server with Ougi? Did they block Ougi?");
      return
    }
    curlType = "user";
    titleCurl = "User: " + thisOBJ.username;
    iconCurl = thisOBJ.avatarURL({dynamic: true, size: 4096});
    if (msg.channel.type === Discord.ChannelType.GuildText) {
      memberCurl = await msg.guild.members.fetch(thisOBJ).catch((e) => {});
      if (memberCurl !== undefined) {
        titleCurl = "Member: " + memberCurl.displayName;
        colorCurl = memberCurl.displayHexColor;
      }
    }
  }
  else if (msg.mentions.channels.first() !== undefined) {
    thisOBJ = await msg.guild.channels.fetch(msg.mentions.channels.first().id);
    curlType = "channel";
    titleCurl = "Channel: #" + thisOBJ.name;
    colorCurl = "#7289DA";
  }
  else if (msg.mentions.roles.first() !== undefined) {
    thisOBJ = await msg.guild.roles.fetch(msg.mentions.roles.first().id);
    curlType = "role";
    titleCurl = "Role: @" + thisOBJ.name;
    colorCurl = thisOBJ.hexColor;
  }
  else if (msg.content.match(/<a{0,1}:[\w-]+:[0-9]+>/)) {
    let potentialEmoji = msg.content.match(/<:[\w-]+:[0-9]+>/);
    client.emojis.cache.each((e) => { if (e.toString() == potentialEmoji) { thisOBJ = e; curlType = "emoji"; iconCurl = e.imageURL(); titleCurl = "Emoji: " + thisOBJ.name + " " + thisOBJ.toString(); colorCurl = "#FFCC4D"; } });
  }
  else if (msg.guild !== undefined && (msg.content.includes("server") || msg.content.includes("guild"))) {
    thisOBJ = msg.guild;
    curlType = "server";
    titleCurl = "Discord server: " + thisOBJ.toString();
    iconCurl = thisOBJ.iconURL({dynamic: true, size: 4096});
    colorCurl = "#8B9BD4";
  }
  else if (msg.content.match(/[0-9]{17,}/)) {
    let potentialID = msg.content.match(/[0-9]{17,}/)[0];
    thisOBJ = await client.users.fetch(potentialID);
    if (thisOBJ !== undefined) {
      curlType = "user";
      titleCurl = "User: " + thisOBJ.username;
      iconCurl = thisOBJ.avatarURL({dynamic: true, size: 4096});
      if (msg.channel.type === Discord.ChannelType.GuildText) {
        memberCurl = await msg.guild.members.members.fetch(thisOBJ).catch((e) => {});
        if (memberCurl !== undefined) {
          titleCurl = "Member: " + memberCurl.displayName;
          colorCurl = memberCurl.displayHexColor;
        }
      }
    }
  }

  if (curlType == null) {
    msg.channel.send("Please specify an user, an emoji, a channel or a Discord server to preview.");
    return
  }

  let embed = new Discord.EmbedBuilder()
  .setTitle(titleCurl)
  .addFields({name: "Discord " + curlType + " created at " + thisOBJ.createdAt.toDateString().slice(4).replace(/ 0/gi, " "), value: ougi.toHumanTime(thisOBJ.createdAt) + " ago."});
  if (memberCurl != null) {
    embed.addFields({name: "Joined " + msg.guild.toString() + " at " + memberCurl.joinedAt.toDateString().slice(4).replace(/ 0/gi, " "), value: ougi.toHumanTime(memberCurl.joinedAt) + " ago."})
    .addFields({name: "__Most distinctive role__", value: memberCurl.roles.hoist.toString()})
    .addFields({name: "__Stats__", value: "**Are they gone?** " + memberCurl.deleted.toString().replace(/false/, "No... Not yet. **SNAPS** " + "<:ougi_snap:744675693295828992>").replace(/true/, "Yes. :sunglasses:") + "\n**Is this member a bot?** " + memberCurl.user.bot.toString().replace(/false/, "Not really. Only at videogames.").replace(/true/, "Yes.") + "\n**Roles:** " + memberCurl.roles.cache.array().length})
    let finalWords = memberCurl.lastMessage;
    if (finalWords != null && !finalWords.content.startsWith("ougi")) {
      embed.setDescription("*\"" + finalWords.content.slice(0,2040) + " ...\"*");
    }
  }
  embed.setColor(colorCurl)
  .setTimestamp()
  .setFooter({text: "curlEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})});
  if (iconCurl != null) {
    embed.setImage(iconCurl).addFields({name: "\u200b", value: "[Click here to download this icon](" + iconCurl + ")"});
  }
  msg.channel.send({embeds: [embed]});
}
