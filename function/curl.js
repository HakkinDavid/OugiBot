const { EmbedBuilder, ChannelType } = require('discord.js');

module.exports = async function curlCommand(msg) {
  let thisOBJ, titleCurl, mentioned, curlType, memberCurl, iconCurl;
  let colorCurl = "#43B581";

  try {
    if (msg.mentions.users.first()) {
      mentioned = msg.mentions.users.first();
      thisOBJ = await client.users.fetch(mentioned.id);
      if (!thisOBJ) {
        await msg.channel.send(await ougi.text(msg, "userFetchFail"));
        return;
      }
      curlType = "user";
      titleCurl = "User: " + thisOBJ.username;
      iconCurl = thisOBJ.avatarURL({ dynamic: true, size: 4096 });
      if (msg.channel.type === ChannelType.GuildText) {
        memberCurl = await msg.guild.members.fetch(thisOBJ).catch(() => null);
        if (memberCurl) {
          titleCurl = "Member: " + memberCurl.displayName;
          colorCurl = memberCurl.displayHexColor;
        }
      }
    } else if (msg.mentions.channels.first()) {
      thisOBJ = await msg.guild.channels.fetch(msg.mentions.channels.first().id);
      curlType = "channel";
      titleCurl = "Channel: #" + thisOBJ.name;
      colorCurl = "#7289DA";
    } else if (msg.mentions.roles.first()) {
      thisOBJ = await msg.guild.roles.fetch(msg.mentions.roles.first().id);
      curlType = "role";
      titleCurl = "Role: @" + thisOBJ.name;
      colorCurl = thisOBJ.hexColor;
    } else if (msg.content.match(/<a{0,1}:[\w-]+:[0-9]+>/)) {
      const potentialEmoji = msg.content.match(/<:[\w-]+:[0-9]+>/)[0];
      client.emojis.cache.each((e) => {
        if (e.toString() === potentialEmoji) {
          thisOBJ = e;
          curlType = "emoji";
          iconCurl = e.url;
          titleCurl = "Emoji: " + e.name + " " + e.toString();
          colorCurl = "#FFCC4D";
        }
      });
    } else if (msg.guild && (msg.content.includes("server") || msg.content.includes("guild"))) {
      thisOBJ = msg.guild;
      curlType = "server";
      titleCurl = "Discord server: " + thisOBJ.toString();
      iconCurl = thisOBJ.iconURL({ dynamic: true, size: 4096 });
      colorCurl = "#8B9BD4";
    } else if (msg.content.match(/[0-9]{17,}/)) {
      const potentialID = msg.content.match(/[0-9]{17,}/)[0];
      thisOBJ = await client.users.fetch(potentialID).catch(() => null);
      if (thisOBJ) {
        curlType = "user";
        titleCurl = "User: " + thisOBJ.username;
        iconCurl = thisOBJ.avatarURL({ dynamic: true, size: 4096 });
        if (msg.channel.type === ChannelType.GuildText) {
          memberCurl = await msg.guild.members.fetch(thisOBJ).catch(() => null);
          if (memberCurl) {
            titleCurl = "Member: " + memberCurl.displayName;
            colorCurl = memberCurl.displayHexColor;
          }
        }
      }
    }

    if (!curlType) {
      await msg.channel.send(await ougi.text(msg, "curlNoTarget"));
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(titleCurl)
      .addFields({
        name: "Discord " + curlType + " created at " + thisOBJ.createdAt.toDateString().slice(4).replace(/ 0/gi, " "),
        value: ougi.toHumanTime(thisOBJ.createdAt) + " ago."
      })
      .setColor(colorCurl)
      .setTimestamp()
      .setFooter({
        text: "curlEmbed by Ougi",
        iconURL: client.user.avatarURL({ dynamic: true, size: 4096 })
      });

    if (memberCurl) {
      embed.addFields({
        name: "Joined " + msg.guild.toString() + " at " + memberCurl.joinedAt.toDateString().slice(4).replace(/ 0/gi, " "),
        value: ougi.toHumanTime(memberCurl.joinedAt) + " ago."
      }).addFields({
        name: "__Most distinctive role__",
        value: memberCurl.roles.hoist?.toString() || await ougi.text(msg, "noDistinctRole")
      });

      const lastMessage = memberCurl.lastMessage;
      if (lastMessage && !lastMessage.content.startsWith("ougi")) {
        embed.setDescription(`*"${lastMessage.content.slice(0, 2040)} ..."*`);
      }
    }

    if (iconCurl) {
      embed.setImage(iconCurl).addFields({
        name: "\u200b",
        value: `[${await ougi.text(msg, "downloadIcon")}](${iconCurl})`
      });
    }

    await msg.channel.send({ embeds: [embed] });

  } catch (error) {
    console.error("Error in curlCommand:", error);
    await msg.channel.send(await ougi.text(msg, "curlError"));
  }
};
