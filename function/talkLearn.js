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
    msg.channel.send(await ougi.text({ msg, stringID: "learn_wrongSyntax", values: { command: "ougi help learn" } })).catch(console.error);
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
    await ougi.text({ msg, stringID: "learn_success1", values: { response, trigger } }),
    await ougi.text({ msg, stringID: "learn_success2", values: { response, trigger } }),
  ];
  let answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];
  answer += await ougi.text({ msg, stringID: "learn_proTip", values: { command: "ougi forget [trigger] :: [response]" } });
  let potentialLinks = response.match(/https{0,1}:\/\//gi) || [];
  if (potentialLinks.length > 0 && msg.author.id !== davidUserID) {
    answer = answer + (await ougi.text({ msg, stringID: "learn_mediaAuditPs" }));
  }

  let embed = new Discord.EmbedBuilder()
  .setTitle(await ougi.text({ lang: 'en', stringID: "log_talkLearnTitle" }))
  .addFields({name: await ougi.text({ lang: 'en', stringID: "log_talkLearnRespField" }), value: response})
  .addFields({name: await ougi.text({ lang: 'en', stringID: "log_talkLearnTrigField" }), value: trigger})
  .setColor("#FF008C")
  .setFooter({text: await ougi.text({ lang: 'en', stringID: "log_globalEmbedFooter" }), icon: client.user.avatarURL({dynamic: true, size: 4096})});

  const added = ougi.db().addKBReply(trigger, response);
  if (!added) {
    msg.channel.send(await ougi.text({ msg, stringID: "learn_alreadyExists" })).catch(console.error);
    return;
  }

  msg.channel.send(answer).catch(console.error);
  client.channels.cache.get(consoleLogging).send({embeds: [embed]});
  if (potentialLinks.length > 0 && msg.author.id !== davidUserID) {
    const mediaNotice = await ougi.text({
      lang: davidUserID,
      stringID: "dev_mediaUploaded",
      values: {
        trigger,
        response
      }
    });
    client.users.cache.get(davidUserID).send(mediaNotice);
  }
}
