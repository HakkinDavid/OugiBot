module.exports =

async function (msg) {
  let newsTopics = ["monogatari series", "ougi becomes a famous streamer", "pancakes take over united hotcakes of kitchenland", "elections", "ougi's source code leaked!!!!", "spooky scary skeletons", "warplight atmos gets an update"];
  let embed = await ougi.helpPreset(msg, "news");
  embed.setDescription((await ougi.text(msg, "newsHelpDesc")))
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi news " + newsTopics[Math.floor(Math.random()*newsTopics.length)] + "`"});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
