module.exports =

async function (msg) {
  if (!(await ougi.guildCheck(msg))) return;
  let phrases = ["sike", "say a bad word", "snipe"];
  let remove = phrases[Math.floor(Math.random()*phrases.length)];
  let out1 = (await ougi.text(msg, "remove_output1")).replace(/{remove}/g, remove).replace(/{guild}/g, msg.guild.toString());
  let out2 = (await ougi.text(msg, "remove_output2")).replace(/{remove}/g, remove).replace(/{guild}/g, msg.guild.toString());
  let afterOptions = [
    out1,
    out2,
  ];
  let answer = afterOptions[Math.floor(Math.random()*afterOptions.length)];
  let embed = await ougi.helpPreset(msg, "blacklist");
  let blTemplate = await ougi.text(msg, "command_blacklistedInGuild");
  embed.setDescription(await ougi.text(msg, "removeHelpDesc"))
  .addFields({name: await ougi.text(msg, "specialPermission"), value: ":warning: " + await ougi.text(msg, "onlyOwner")})
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi blacklist " + remove + "`"})
  .addFields({name: await ougi.text(msg, "output"), value: answer})
  .addFields({name: await ougi.text(msg, "remove_afterExecutionField"), value: "`ougi " + remove + "`"})
  .addFields({name: await ougi.text(msg, "output"), value: blTemplate.replace(/{guild}/g, msg.guild.toString())});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
