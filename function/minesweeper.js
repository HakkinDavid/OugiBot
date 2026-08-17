module.exports = async function (msg) {
  let spookyCake = msg.content.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim();
  let spookySlices = spookyCake.split(" ");
  let args = spookySlices.slice(2);

  let thisMessage = args.join(" ");
  let breakChocolate = thisMessage.split("::").slice(1);
  let icon = msg.author.displayAvatarURL({ dynamic: true, size: 4096 });
  let embedColor = "#230347";
  if (msg.inGuild && msg.inGuild() && msg.guild) {
    icon = msg.guild.iconURL() || icon;
  }
  let difficulty = 5;
  let treasures = [];
  let fillers = [];
  let mine = [];
  let minesweeperEmbed = new Discord.EmbedBuilder()
    .setColor(embedColor)
    .setFooter({ text: await ougi.text({ msg, stringID: "minesweeper_footer", values: { username: msg.author.username } }), iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
    .setThumbnail(icon);

  for (let i = 0; i < breakChocolate.length; i++) {
    let material = breakChocolate[i].trim();
    if (material.startsWith("title ")) {
      material = material.substring(6).trim();
      if (material.length < 1 || material.length > 256) {
        msg.channel.send(await ougi.text({ msg, stringID: "minesweeper_titleLimit" }));
        return;
      }
      minesweeperEmbed.setTitle(material);
    }
    else if (material.startsWith("fill ")) {
      material = material.substring(5).trim();
      if (material.length < 1 || material.length > 60) {
        msg.channel.send(await ougi.text({ msg, stringID: "minesweeper_fillTooLong" }));
        return;
      }
      fillers.push(material);
    }
    else if (material.startsWith("treasure ")) {
      material = material.substring(9).trim();
      if (material.length < 1 || material.length > 60) {
        msg.channel.send(await ougi.text({ msg, stringID: "minesweeper_treasureTooLong" }));
        return;
      }
      treasures.push(material);
    }
    else if (material.startsWith("difficulty ")) {
      material = material.substring(11).trim();
      const diffNum = parseInt(material, 10);
      if (isNaN(diffNum) || diffNum < 1 || diffNum > 10) {
        msg.channel.send(await ougi.text({ msg, stringID: "minesweeper_difficultyRange" }));
        return;
      }
      difficulty = diffNum;
    }
    else {
      msg.channel.send(await ougi.text({ msg, stringID: "minesweeper_syntaxHelp", values: { command: "ougi help minesweeper" } }));
      return;
    }
  }

  if (treasures.length < 1) {
    treasures = ["🌮", "🥝", "🥞", "🥓"];
  }
  if (fillers.length < 1) {
    fillers = ["💣", "⬛"];
  }
  for (let i = 0; i < 288; i++) {
    if (Math.floor(Math.random() * 10) >= difficulty) {
      mine.push(treasures[Math.floor(Math.random() * treasures.length)]);
    }
    else {
      mine.push(fillers[Math.floor(Math.random() * fillers.length)]);
    }
  }

  let minebombs = "||" + mine.join("||||") + "||";
  if (minebombs.length > 2048) {
    minebombs = minebombs.slice(0, 2048);
    const lastSpoiler = minebombs.lastIndexOf("||");
    if (lastSpoiler !== -1) {
      minebombs = minebombs.slice(0, lastSpoiler + 2);
    }
  }

  minesweeperEmbed.setDescription(minebombs);
  msg.channel.send({ embeds: [minesweeperEmbed] }).catch(console.error);
};
