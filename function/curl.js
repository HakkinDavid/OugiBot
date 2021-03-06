module.exports =

function (msg) {
  let thisOBJ, titleCurl, mentioned, curlType, memberCurl, iconCurl;
  let colorCurl = "#43B581";
  if (msg.mentions.users.first() != null) {
    mentioned = msg.mentions.users.first();
    if (!client.users.cache.has(mentioned.id)) {
      msg.channel.send("User couldn't be fetched. Do them share a Discord server with Ougi? Did them block Ougi?");
      return
    }
    curlType = "user";
    thisOBJ = client.users.cache.get(mentioned.id);
    titleCurl = "User: " + thisOBJ.tag;
    iconCurl = thisOBJ.avatarURL({dynamic: true, size: 4096});
    if (msg.channel.type == "text") {
      isMember = msg.guild.member(thisOBJ);
      if (isMember != null) {
        memberCurl = isMember;
        titleCurl = "Member: " + memberCurl.displayName;
        colorCurl = memberCurl.displayHexColor;
      }
    }
  }
  else if (msg.mentions.channels.first() != null) {
    thisOBJ = msg.guild.channels.cache.get(msg.mentions.channels.first().id);
    curlType = "channel";
    titleCurl = "Channel: #" + thisOBJ.name;
    colorCurl = "#7289DA";
  }
  else if (msg.mentions.roles.first() != null) {
    thisOBJ = msg.guild.roles.cache.get(msg.mentions.roles.first().id);
    curlType = "role";
    titleCurl = "Role: @" + thisOBJ.name;
    colorCurl = thisOBJ.hexColor;
  }
  else if (msg.content.match(/<:[\w-]+:[0-9]+>/)) {
    potentialEmoji = msg.content.match(/<:[\w-]+:[0-9]+>/);
    client.emojis.cache.each((e) => { if (e.toString() == potentialEmoji) { thisOBJ = e; curlType = "emoji"; iconCurl = e.url; titleCurl = "Emoji: " + thisOBJ.name + " " + thisOBJ.toString(); colorCurl = "#FFCC4D"; } });
  }
  else if (msg.guild != null && msg.content.includes("server") || msg.content.includes("guild")) {
    thisOBJ = msg.guild;
    curlType = "server";
    titleCurl = "Discord server: " + thisOBJ.toString();
    iconCurl = thisOBJ.iconURL({dynamic: true, size: 4096});
    colorCurl = "#8B9BD4";
  }

  if (curlType == null) {
    msg.channel.send("Please specify an user, an emoji, a channel or a Discord server to preview.");
    return
  }

  let embed = new Discord.MessageEmbed()
  .setTitle(titleCurl)
  .addField("Discord " + curlType + " created at " + thisOBJ.createdAt.toDateString().slice(4).replace(/ 0/gi, " "), ougi.toHumanTime(thisOBJ.createdAt) + " ago.");
  if (memberCurl != null) {
    embed.addField("Joined " + msg.guild.toString() + " at " + memberCurl.joinedAt.toDateString().slice(4).replace(/ 0/gi, " "), ougi.toHumanTime(memberCurl.joinedAt) + " ago.")
    .addField("__Most distinctive role__", memberCurl.roles.hoist.toString())
    .addField("__Stats__", "**Are they gone?** " + memberCurl.deleted.toString().replace(/false/, "No... Not yet. **SNAPS** " + "<:ougi_snap:744675693295828992>").replace(/true/, "Yes. :sunglasses:") + "\n**Is this member a bot?** " + memberCurl.user.bot.toString().replace(/false/, "Not really. Only at videogames.").replace(/true/, "Yes.") + "\n**Roles:** " + memberCurl.roles.cache.array().length)
    let finalWords = memberCurl.lastMessage;
    if (finalWords != null && !finalWords.content.startsWith("ougi")) {
      embed.setDescription("*\"" + finalWords.content.slice(0,2040) + " ...\"*");
    }
  }
  embed.setColor(colorCurl)
  .setTimestamp()
  .setFooter("curlEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}));
  if (iconCurl != null) {
    embed.setImage(iconCurl).addField("\u200b", "[Click here to download this icon](" + iconCurl + ")");
  }
  msg.channel.send(embed);
}
