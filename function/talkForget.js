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
    msg.channel.send("Do you want to make me forget something? Looks like you're wearing your sunglasses wrong. Use the following command for some help.\n> ougi help forget").catch(console.error);
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
    "I'll stop replying `" + response + "` when anyone says `" + trigger + "`",
    "Of course I already knew I shouldn't say `" + response + "` when anyone says `" + trigger + "`",
  ];
  let answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];

  if (knowledgeBase.hasOwnProperty(trigger)){
    let existent = knowledgeBase[trigger];
    for (let i = 0; i < existent.length; i++) {
      if (existent[i].toLowerCase() === response) {
        existent.splice(i, 1);
        msg.channel.send(answer).catch(console.error);
        let embed = new Discord.MessageEmbed()
        .setTitle("Input for talkForget")
        .addField("Response to be deleted", response)
        .setColor("#00FF73")
        .setFooter("globalLogEmbed by Ougi", client.user.avatarURL({dynamic: true, size: 4096}))

        knowledgeBase[trigger] = existent;
        if (existent.length < 1) {
          delete knowledgeBase[trigger];
          embed.addField("Trigger to be deleted", trigger);
        }
        else {
          embed.addField("From trigger", trigger)
        }
        
        client.channels.cache.get(consoleLogging).send({embed});
        await fs.writeFile('./responses.txt', JSON.stringify(knowledgeBase, null, 4), console.error);

        await ougi.backup("./responses.txt", backupChannel);
        return
      }
    }
    msg.channel.send("Sorry, this response doesn't match any from this trigger.").catch(console.error);
    return
  }

  else {
    msg.channel.send("This trigger doesn't exist in my database.")
  }
}
