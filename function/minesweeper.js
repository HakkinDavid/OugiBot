module.exports =

async function (msg) {
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
  var thisMessage = arguments.join(" ");
  var breakChocolate = thisMessage.split("::").slice(1);
  let icon = msg.author.avatarURL();
  let embedColor = "#230347";
  if (msg.channel.type == "text") {
    icon = msg.guild.iconURL()
  }
  let difficulty = 5;
  let treasures = [];
  let fillers = [];
  let mine = [];
  let minesweeperEmbed = new Discord.MessageEmbed()
    .setColor(embedColor)
    .setFooter("minesweeperEmbed by Ougi & " + msg.author.username, client.user.avatarURL())
    .setThumbnail(icon);
  for (i=0; breakChocolate.length > i; i++) {
    let material = breakChocolate[i];
    if (material.endsWith(" ")) {
      material = material.slice(0, material.length-1)
    }
    if (material.startsWith("title ")) {
      material = material.substring(6);
      if (material.length < 1 || material.length > 256) {
        msg.channel.send("Title must be between 1 and 256 characters long.");
        return
      }
      minesweeperEmbed.setTitle(material)
    }
    else if (material.startsWith("fill ")) {
      material = material.substring(5);
      if (material.length < 1 || material.length > 60) {
        msg.channel.send("That filling content is excessively long.");
        return
      }
      fillers.push(material);
    }
    else if (material.startsWith("treasure ")) {
      material = material.substring(9);
      if (material.length < 1 || material.length > 60) {
        msg.channel.send("That treasure content is excessively long.");
        return
      }
      treasures.push(material);
    }
    else if (material.startsWith("difficulty ")) {
      material = material.substring(11);
      if (isNaN(material)) {
        msg.channel.send("Difficulty must be a number between 1 and 10");
        return
      }
      if (material < 1 || material > 10) {
        msg.channel.send("Difficulty must be a number between 1 and 10");
        return
      }
      difficulty = material;
    }
    else {
      msg.channel.send("Perhaps you're doing it wrong. Refer to the following command for usage information.\n> ougi help minesweeper");
      return
    }
  }
  if (treasures.length < 1) {
    treasures = ["🌮","🥝","🥞","🥓"];
  }
  if (fillers.length < 1) {
    fillers = ["💣","⬛"];
  }
  for (i=0; i < 288; i++) {
    if (Math.floor(Math.random()*10) >= difficulty) {
      mine.push(treasures[Math.floor(Math.random()*treasures.length)])
    }
    else {
      mine.push(fillers[Math.floor(Math.random()*fillers.length)])
    }
  }
  let minebombs = "||" + mine.join("||||") + "||";
  minebombs = minebombs.substring(0, 2048);
  while (!minebombs.endsWith("||") || minebombs.endsWith("|||")) {
    minebombs = minebombs.substring(0, minebombs.length-1);
  }
  minesweeperEmbed.setDescription(minebombs);
  msg.channel.send(minesweeperEmbed);
}
