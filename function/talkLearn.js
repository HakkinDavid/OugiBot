module.exports =

async function (arguments, msg) {
  let thisMessage = arguments.join(" ");

  if (msg.content.includes("@everyone") || msg.content.includes("@here")) {
    msg.channel.send("Ora ora ora ora! Remove that massive ping.");
    return
  }

  if (thisMessage.includes("<@") && thisMessage.includes(">")) {
    msg.channel.send("Avoid mentions please. What? Isn't that a mention? Well, then don't include '\<\@' and '>' in the same message.").catch(console.error);
    return
  }

  let breakChocolate = thisMessage.split("::");
  let niceCharacterAmount = 3;
  let maxCharacterAmount = 164;

  if (msg.author.id == davidUserID) {
    niceCharacterAmount = 1;
    maxCharacterAmount = 2000;
  }

  if (breakChocolate.length !== 2){
    msg.channel.send("Do you want to teach me something? Looks like you're doing it wrong. Use the following command for some help.\n> ougi help learn").catch(console.error);
    return
  }

  let trigger = breakChocolate[0].toString();
  let response = breakChocolate[1].toString();

  while (trigger.startsWith("ougi")){
    trigger = trigger.substring(4, trigger.length)
  }

  while (trigger.startsWith("#ougi")){
    trigger = trigger.substring(5, trigger.length)
  }

  while (trigger.startsWith("@ougi")){
    trigger = trigger.substring(5, trigger.length)
  }

  while (trigger.endsWith(" ")){
    trigger = trigger.substring(0, trigger.length-1)
  }

  while (response.endsWith(" ")){
    response = response.substring(0, response.length-1)
  }

  while (trigger.startsWith(" ")){
    trigger = trigger.substring(1, trigger.length)
  }

  while (response.startsWith(" ")){
    response = response.substring(1, response.length)
  }

  if (trigger.length < niceCharacterAmount){
    msg.channel.send("Please provide a trigger phrase of at least " + niceCharacterAmount.toString() + " characters long.").catch(console.error);
    return
  }

  if (response.length < niceCharacterAmount){
    msg.channel.send("Please provide a response phrase of at least " + niceCharacterAmount.toString() + " characters long.").catch(console.error);
    return
  }

  if (trigger.length > maxCharacterAmount){
    msg.channel.send("Please provide a trigger phrase of " + maxCharacterAmount.toString() + " or less characters long.").catch(console.error);
    return
  }

  if (response.length > maxCharacterAmount){
    msg.channel.send("Please provide a response phrase of " + maxCharacterAmount.toString() + " or less characters long.").catch(console.error);
    return
  }

  let afterOptions = [
    "I'll start replying `" + response + "` when anyone says `" + trigger + "`",
    "Of course I already knew I should say `" + response + "` when anyone says `" + trigger + "`, I was just making sure you knew too~",
  ];
  let answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];
  let potentialLinks = response.match(/https{0,1}:\/\//gi) || [];
  if (potentialLinks.length > 0 && msg.author.id !== davidUserID) {
    answer = answer + "\n\n```P.S. Since this response seems to include media, and because learn command is Ougi's main source of public replies, it will be audited by Ougi's developer (just to make sure nothing NSFW or illegal is stored).```";
  }

  let embed = new Discord.MessageEmbed()
  .setTitle("Input for talkLearn")
  .addField("Response to be added", response)
  .addField("With trigger", trigger)
  .setColor("#FF008C")
  .setFooter("globalLogEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}));

  if (knowledgeBase.hasOwnProperty(trigger)) {
    let existent = knowledgeBase[trigger];
    for (let i = 0; i < existent.length; i++) {
      if (existent[i].toLowerCase() === response) {
        msg.channel.send("Sorry, that response for this trigger already exists.").catch(console.error);
        return
      }
    }
    existent.push(response);
    msg.channel.send(answer).catch(console.error);

    client.channels.cache.get(consoleLogging).send({embed});
    knowledgeBase[trigger] = existent;
    await fs.writeFile('./responses.txt', JSON.stringify(knowledgeBase, null, 4), console.error);

    await ougi.backup("./responses.txt", backupChannel);
    if (potentialLinks.length > 0 && msg.author.id !== davidUserID) client.users.cache.get(davidUserID).send("User uploaded media.\n" + "**Trigger:** " + trigger + "\n**Response:** " + response);
    return
  }

  msg.channel.send(answer).catch(console.error);

  client.channels.cache.get(consoleLogging).send({embed});

  knowledgeBase[trigger] = [];
  let arrayMaker = knowledgeBase[trigger];
  arrayMaker.push(response);
  knowledgeBase[trigger] = arrayMaker;
  await fs.writeFile('./responses.txt', JSON.stringify(knowledgeBase, null, 4), console.error);

  await ougi.backup("./responses.txt", backupChannel);
  if (potentialLinks.length > 0 && msg.author.id !== davidUserID) client.users.cache.get(davidUserID).send("User uploaded media.\n" + "**Trigger:** " + trigger + "\n**Response:** " + response);
  return
}
