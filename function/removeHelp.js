module.exports =

async function (msg) {
  if (!(await ougi.guildCheck(msg))) return;
  let phrases = ["sike", "say a bad word", "snipe"];
  let remove = phrases[Math.floor(Math.random()*phrases.length)];
  let out1 = await ougi.text({ msg, stringID: "remove_output1", values: { remove, guild: msg.guild.toString() } });
  let out2 = await ougi.text({ msg, stringID: "remove_output2", values: { remove, guild: msg.guild.toString() } });
  let afterOptions = [
    out1,
    out2,
  ];
  let answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];
  let embed = await ougi.helpPreset(msg, "blacklist");
  embed.setDescription(await ougi.text({ msg, stringID: "removeHelpDesc" }))
  .addFields({name: await ougi.text({ msg, stringID: "specialPermission" }), value: ":warning: " + await ougi.text({ msg, stringID: "onlyOwner" })})
  .addFields({name: await ougi.text({ msg, stringID: "example" }), value: "`ougi blacklist " + remove + "`"})
  .addFields({name: await ougi.text({ msg, stringID: "output" }), value: answer})
  .addFields({name: await ougi.text({ msg, stringID: "remove_afterExecutionField" }), value: "`ougi " + remove + "`"})
  .addFields({name: await ougi.text({ msg, stringID: "output" }), value: await ougi.text({ msg, stringID: "command_blacklistedInGuild", values: { guild: msg.guild.toString() } })});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
