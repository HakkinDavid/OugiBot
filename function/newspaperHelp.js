module.exports =

async function (msg) {
  var news = ["Ougi woke up with a headache.", "Ougi likes chilaquiles.", "Ougi needs 298 yen.", "Ougi stole " + msg.author.username + "'s chocolate bar."];
  var embed = await ougi.helpPreset(msg, "newspaper");
  embed.setDescription(await ougi.text({ msg, stringID: "newspaperHelpDesc" }))
  .addFields({name: await ougi.text({ msg, stringID: "example" }), value: "`ougi newspaper " + Math.floor(Math.random()*news.length) + "`"})
  .addFields({name: await ougi.text({ msg, stringID: "output" }), value: news[Math.floor(Math.random()*news.length)]});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
