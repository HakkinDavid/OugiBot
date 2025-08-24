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
  let arguments = spookySlices.slice(2);
  /*-----------------------------------*/

  let thisMessage = arguments.join(" ");
  let breakChocolate = thisMessage.split("::").slice(1);
  if (breakChocolate.length < 2) {
    msg.channel.send("You must include a title, a description, and optionally a type.")
    return
  }
  let spookyConstructor = new Discord.EmbedBuilder()
    .setFooter({text: "newsletterEmbed by Ougi"})
    .setTimestamp()
    .setColor("#F5F2F2")
    .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/news.png?raw=true");
  for (i=0; breakChocolate.length > i; i++) {
    let material = breakChocolate[i];
    if (material.endsWith(" ")) {
      material = material.slice(0, material.length-1)
    }
    if (material.startsWith("type ")) {
      material = material.slice(5);
      var embedType = material;
      if (material == "info") {
        spookyConstructor
        .setColor("#1C22C9")
        .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/info.png?raw=true");
      }
      else if (material == "mail") {
        spookyConstructor
        .setColor("#F5F2F2")
        .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/news.png?raw=true");
      }
      else if (material == "alert") {
        spookyConstructor
        .setColor("#C9A71C")
        .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/doritoalert.png?raw=true");
      }
      else if (material == "fatal") {
        spookyConstructor
        .setColor("#FC0000")
        .setThumbnail("https://github.com/HakkinDavid/OugiBot/blob/master/images/fatal.png?raw=true");
      }
      else {
        msg.channel.send("Not a valid type. Types: info, mail, alert, fatal.");
        return
      }
    }
    else if (material.startsWith("title ")) {
      material = material.slice(6);
      spookyConstructor.setTitle(material);
      var hasTitle = true;
      var embedName = material;
    }
    else if (material.startsWith("description ")) {
      material = material.slice(12);
      spookyConstructor.setDescription(material);
      var embedDesc = material;
      var hasDesc = true;
    }
    else {
      msg.channel.send("Wrong syntax.");
      return
    }
  }
  if (!hasTitle || !hasDesc) {
    msg.channel.send("You must include a title, a description, and optionally a type.");
    return
  }
  let names = [];
  let mod = 0;
  for (i=0; settingsOBJ.subscribers.length > i; i++) {
    let aSub = null;
    try { aSub = await client.users.fetch(settingsOBJ.subscribers[i]); }
    catch { console.log("Subscriber " + settingsOBJ.subscribers[i] + " is unreachable."); }
    if (aSub) {
      aSub.send({embeds: [spookyConstructor]}).catch(console.error);
      names.push(aSub.username);
    }
    else {
      mod++
    }
  }
  for (let getKey in settingsOBJ.guildNews) {
    let newsDoor = null;
    try { await client.channels.fetch(settingsOBJ.guildNews[getKey]); }
    catch { console.log("Channel " + settingsOBJ.guildNews[getKey] + " in server " + getKey + " is unreachable."); }
    if (newsDoor) {
      newsDoor.send({embeds: [spookyConstructor]}).catch(console.error);
      names.push(newsDoor.toString());
    }
    else {
      mod++
    }
  }
  if (mod > 0) {
    ougi.globalLog("Skipped " + mod + " invalid IDs.")
  }
  let newsArray = ougi.readFile(database.news.file, 'utf-8', console.error);
  let thisArray = {
    title: embedName,
    desc: embedDesc,
    type: embedType,
    sent: new Date().toDateString()
  };
  newsArray.push(thisArray);
  let proArray = JSON.stringify(newsArray, null, 4);
  let myEmbed = database.news.file;
  await ougi.writeFile(database.news.file, proArray, console.error);

  await ougi.backup(myEmbed, channels.news);
  msg.channel.send("Sent this newsletter to:\n" + names.join('\n'), {embeds: [spookyConstructor]});
}
