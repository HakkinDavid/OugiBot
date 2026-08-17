const { EmbedBuilder, ChannelType } = require('discord.js');

module.exports = async function (msg) {
  let thisOBJ, titleCurl, mentioned, curlType, memberCurl, iconCurl;
  let colorCurl = "#43B581";

  try {
    if (msg.mentions.users.first()) {
      mentioned = msg.mentions.users.first();
      thisOBJ = await client.users.fetch(mentioned.id).catch(() => null);
      if (!thisOBJ) {
        await msg.channel.send(await ougi.text({ msg, stringID: "userFetchFail" }));
        return;
      }
      curlType = "user";
      titleCurl = "User: " + thisOBJ.username;
      iconCurl = thisOBJ.displayAvatarURL({ dynamic: true, size: 4096 });
      if (msg.inGuild && msg.inGuild()) {
        memberCurl = await msg.guild.members.fetch(thisOBJ.id).catch(() => null);
        if (memberCurl) {
          titleCurl = "Member: " + memberCurl.displayName;
          colorCurl = memberCurl.displayHexColor || "#43B581";
        }
      }
    } else if (msg.mentions.channels.first()) {
      thisOBJ = await msg.guild.channels.fetch(msg.mentions.channels.first().id).catch(() => null);
      if (!thisOBJ) return;
      curlType = "channel";
      titleCurl = "Channel: #" + thisOBJ.name;
      colorCurl = "#7289DA";
    } else if (msg.mentions.roles.first()) {
      thisOBJ = await msg.guild.roles.fetch(msg.mentions.roles.first().id).catch(() => null);
      if (!thisOBJ) return;
      curlType = "role";
      titleCurl = "Role: @" + thisOBJ.name;
      colorCurl = thisOBJ.hexColor || "#7289DA";
    } else if (msg.content.match(/<a?:\w+:[0-9]+>/)) {
      const potentialEmoji = msg.content.match(/<a?:\w+:[0-9]+>/)[0];
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
        iconCurl = thisOBJ.displayAvatarURL({ dynamic: true, size: 4096 });
        if (msg.inGuild && msg.inGuild()) {
          memberCurl = await msg.guild.members.fetch(thisOBJ.id).catch(() => null);
          if (memberCurl) {
            titleCurl = "Member: " + memberCurl.displayName;
            colorCurl = memberCurl.displayHexColor || "#43B581";
          }
        }
      }
    }

    if (!curlType || !thisOBJ) {
      await msg.channel.send(await ougi.text({ msg, stringID: "curlNoTarget" }));
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(titleCurl)
      .addFields({
        name: await ougi.text({
          msg,
          stringID: "curl_createdAtField",
          values: {
            type: curlType,
            date: thisOBJ.createdAt.toDateString().slice(4).replace(/ 0/gi, " ")
          }
        }),
        value: await ougi.text({
          msg,
          stringID: "curl_timeAgo",
          values: {
            time: ougi.toHumanTime(thisOBJ.createdAt)
          }
        })
      })
      .setColor(colorCurl)
      .setTimestamp()
      .setFooter({
        text: await ougi.text({ msg, stringID: "curl_footer" }),
        iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 })
      });

    if (memberCurl && memberCurl.joinedAt) {
      embed.addFields({
        name: await ougi.text({
          msg,
          stringID: "curl_joinedAtField",
          values: {
            guild: msg.guild.toString(),
            date: memberCurl.joinedAt.toDateString().slice(4).replace(/ 0/gi, " ")
          }
        }),
        value: await ougi.text({
          msg,
          stringID: "curl_timeAgo",
          values: {
            time: ougi.toHumanTime(memberCurl.joinedAt)
          }
        })
      }).addFields({
        name: await ougi.text({ msg, stringID: "curl_mostDistinctiveRole" }),
        value: memberCurl.roles.hoist?.toString() || await ougi.text({ msg, stringID: "noDistinctRole" })
      });
    }

    if (iconCurl) {
      embed.setImage(iconCurl).addFields({
        name: "\u200b",
        value: `[${await ougi.text({ msg, stringID: "downloadIcon" })}](${iconCurl})`
      });
    }

    await msg.channel.send({ embeds: [embed] });

  } catch (error) {
    console.error("Error in curlCommand:", error);
    await msg.channel.send(await ougi.text({ msg, stringID: "curlError" })).catch(() => {});
  }
};
