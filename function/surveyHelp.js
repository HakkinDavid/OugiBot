module.exports =

async function (msg) {
  let embed = await ougi.helpPreset(msg, "survey");
  embed.setDescription(await ougi.text({ msg, stringID: "surveyHelpDesc" }))
  .addFields({name: await ougi.text({ msg, stringID: "example" }), value: "`ougi survey`"});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
