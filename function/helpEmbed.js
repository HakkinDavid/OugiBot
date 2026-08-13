module.exports = async function (msg) {
  let commandsArray = ougi.commandList.getNames();
  let embed = await ougi.helpPreset(msg);
  embed.setTitle(await ougi.text(msg, "helpTitle"))
    .setDescription(await ougi.text(msg, "helpDesc"))
    .addFields({ name: await ougi.text(msg, "helpPrefix"), value: "`ougi`\n" + await ougi.text(msg, "helpPrefixExplanation") })
    .addFields({ name: await ougi.text(msg, "availableCommands"), value: await ougi.text(msg, "availableCommandsList") + ": `" + commandsArray.join("`, `") + "`. " + await ougi.text(msg, "improving") })
    .addFields({ name: await ougi.text(msg, "privacyPolicy") + "\n\u200b", value: (await ougi.text(msg, "remindLang")).replace(/{c1}/gi, "`ougi language [lang]`").replace(/{c2}/gi, "`ougi help [command]`") });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
