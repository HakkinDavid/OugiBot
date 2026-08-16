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
    msg.channel.send(await ougi.text({ msg, stringID: "forget_wrongSyntax", values: { command: "ougi help forget" } })).catch(console.error);
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
    msg.channel.send(await ougi.text({ msg, stringID: "learn_triggerMinLength", values: { count: niceCharacterAmount.toString() } })).catch(console.error);
    return
  }

  if (response.length < niceCharacterAmount){
    msg.channel.send(await ougi.text({ msg, stringID: "learn_responseMinLength", values: { count: niceCharacterAmount.toString() } })).catch(console.error);
    return
  }

  if (trigger.length > maxCharacterAmount){
    msg.channel.send(await ougi.text({ msg, stringID: "learn_triggerMaxLength", values: { count: maxCharacterAmount.toString() } })).catch(console.error);
    return
  }

  if (response.length > maxCharacterAmount){
    msg.channel.send(await ougi.text({ msg, stringID: "learn_responseMaxLength", values: { count: maxCharacterAmount.toString() } })).catch(console.error);
    return
  }

  let afterOptions = [
    await ougi.text({ msg, stringID: "forget_success1", values: { response, trigger } }),
    await ougi.text({ msg, stringID: "forget_success2", values: { response, trigger } }),
  ];
  let answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];

  const removed = ougi.db().removeKBReply(trigger, response);
  if (removed) {
    msg.channel.send(answer).catch(console.error);
    let embed = new Discord.EmbedBuilder()
    .setTitle(await ougi.text({ lang: 'en', stringID: "log_talkForgetTitle" }))
    .addFields({name: await ougi.text({ lang: 'en', stringID: "log_talkForgetRespField" }), value: response})
    .addFields({name: await ougi.text({ lang: 'en', stringID: "log_talkForgetTrigField" }), value: trigger})
    .setColor("#00FF73")
    .setFooter({text: await ougi.text({ lang: 'en', stringID: "log_globalEmbedFooter" }), icon: client.user.avatarURL({dynamic: true, size: 4096})});
    client.channels.cache.get(consoleLogging).send({embeds: [embed]});
    return;
  }
  msg.channel.send(await ougi.text({ msg, stringID: "forget_notFound" })).catch(console.error);
}
