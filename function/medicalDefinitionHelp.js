module.exports =

async function (msg) {
  let conceptsArray = ["COVID-19", "coronavirus", "pandemic", "face mask", "quarantine", "safe distance", "symptom"];
  let embed = await ougi.helpPreset(msg, "md");
  embed.setDescription((await ougi.text(msg, "medicalDefinitionDesc")))
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi md " + conceptsArray[Math.floor(Math.random()*conceptsArray.length)] +"`"});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
