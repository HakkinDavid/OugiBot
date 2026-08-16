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
    msg.channel.send(await ougi.text(msg, "forget_wrongSyntax")).catch(console.error);
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

  const forgetSuccess1Template = await ougi.text(msg, "forget_success1");
  const forgetSuccess2Template = await ougi.text(msg, "forget_success2");

  let afterOptions = [
    forgetSuccess1Template.replace(/{response}/g, response).replace(/{trigger}/g, trigger),
    forgetSuccess2Template.replace(/{response}/g, response).replace(/{trigger}/g, trigger),
  ];
  let answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];

  const removed = ougi.db().removeKBReply(trigger, response);
  if (removed) {
    msg.channel.send(answer).catch(console.error);
    let embed = new Discord.EmbedBuilder()
    .setTitle(await ougi.text('en', "log_talkForgetTitle"))
    .addFields({name: await ougi.text('en', "log_talkForgetRespField"), value: response})
    .addFields({name: await ougi.text('en', "log_talkForgetTrigField"), value: trigger})
    .setColor("#00FF73")
    .setFooter({text: await ougi.text('en', "log_globalEmbedFooter"), icon: client.user.avatarURL({dynamic: true, size: 4096})});
    client.channels.cache.get(consoleLogging).send({embeds: [embed]});
    return;
  }
  msg.channel.send(await ougi.text(msg, "forget_notFound")).catch(console.error);
}
