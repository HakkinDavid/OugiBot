module.exports = async function (msg) {
  let commandsArray = ougi.commandList.getNames();
  let embed = await ougi.helpPreset(msg);
  embed.setTitle(await ougi.text({ msg, stringID: "helpTitle" }))
    .setDescription(await ougi.text({ msg, stringID: "helpDesc" }))
    .addFields({ name: await ougi.text({ msg, stringID: "helpPrefix" }), value: "`ougi`\n" + await ougi.text({ msg, stringID: "helpPrefixExplanation" }) })
    .addFields({ name: await ougi.text({ msg, stringID: "availableCommands" }), value: await ougi.text({ msg, stringID: "availableCommandsList" }) + ": `" + commandsArray.join("`, `") + "`. " + await ougi.text({ msg, stringID: "improving" }) })
    .addFields({ name: await ougi.text({ msg, stringID: "privacyPolicy", values: { command: "`ougi acknowledgement`" } }) + "\n\u200b", value: await ougi.text({ msg, stringID: "remindLang", values: { c1: "`ougi language [lang]`", c2: "`ougi help [command]`" } }) });

  msg.channel.send({ embeds: [embed] }).catch(console.error);
};
