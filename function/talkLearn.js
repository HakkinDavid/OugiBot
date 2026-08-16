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
    msg.channel.send(await ougi.text(msg, "learn_wrongSyntax")).catch(console.error);
    return
  }

  let trigger = breakChocolate[0].toString();
  let response = breakChocolate[1].toString();

  trigger = ougi.helperFunctions.stripPrefixStr(trigger, msg.guildId);

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
    const trigMinTemplate = await ougi.text(msg, "learn_triggerMinLength");
    msg.channel.send(trigMinTemplate.replace(/{count}/g, niceCharacterAmount.toString())).catch(console.error);
    return
  }

  if (response.length < niceCharacterAmount){
    const respMinTemplate = await ougi.text(msg, "learn_responseMinLength");
    msg.channel.send(respMinTemplate.replace(/{count}/g, niceCharacterAmount.toString())).catch(console.error);
    return
  }

  if (trigger.length > maxCharacterAmount){
    const trigMaxTemplate = await ougi.text(msg, "learn_triggerMaxLength");
    msg.channel.send(trigMaxTemplate.replace(/{count}/g, maxCharacterAmount.toString())).catch(console.error);
    return
  }

  if (response.length > maxCharacterAmount){
    const respMaxTemplate = await ougi.text(msg, "learn_responseMaxLength");
    msg.channel.send(respMaxTemplate.replace(/{count}/g, maxCharacterAmount.toString())).catch(console.error);
    return
  }

  const learnSuccess1Template = await ougi.text(msg, "learn_success1");
  const learnSuccess2Template = await ougi.text(msg, "learn_success2");

  let afterOptions = [
    learnSuccess1Template.replace(/{response}/g, response).replace(/{trigger}/g, trigger),
    learnSuccess2Template.replace(/{response}/g, response).replace(/{trigger}/g, trigger),
  ];
  let answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];
  answer += await ougi.text(msg, "learn_proTip");
  let potentialLinks = response.match(/https{0,1}:\/\//gi) || [];
  if (potentialLinks.length > 0 && msg.author.id !== davidUserID) {
    answer = answer + (await ougi.text(msg, "learn_mediaAuditPs"));
  }

  let embed = new Discord.EmbedBuilder()
  .setTitle("Input for talkLearn")
  .addFields({name: "Response to be added", value: response})
  .addFields({name: "With trigger", value: trigger})
  .setColor("#FF008C")
  .setFooter({text: "globalLogEmbed by Ougi", icon: client.user.avatarURL({dynamic: true, size: 4096})});

  const added = ougi.db().addKBReply(trigger, response);
  if (!added) {
    msg.channel.send(await ougi.text(msg, "learn_alreadyExists")).catch(console.error);
    return;
  }

  msg.channel.send(answer).catch(console.error);
  client.channels.cache.get(consoleLogging).send({embeds: [embed]});
  if (potentialLinks.length > 0 && msg.author.id !== davidUserID) client.users.cache.get(davidUserID).send("User uploaded media.\n" + "**Trigger:** " + trigger + "\n**Response:** " + response);
}
