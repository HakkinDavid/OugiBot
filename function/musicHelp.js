module.exports =

async function (msg) {
  var videos = ["angels on my side", "every one of us", "never gonna give you up", "chocolate insomnia midi by hakkindavid", "07734 midi by hakkindavid"];
  var links = ["https://www.youtube.com/watch?v=Q2yderDJKJA", "https://www.youtube.com/watch?v=MsHk2Z41riE", "https://www.youtube.com/watch?v=7qZugJCf2eI", "https://www.youtube.com/watch?v=HPOKr-Wyscw", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"];
  var embed = await ougi.helpPreset(msg, "music");
  embed.setDescription(await ougi.text({ msg, stringID: "musicHelpDesc" }))
  .addFields({name: await ougi.text({ msg, stringID: "example" }), value: "`ougi music " + videos[Math.floor(Math.random()*videos.length)] + "`"})
  .addFields({name: await ougi.text({ msg, stringID: "music_proTipField" }), value: await ougi.text({ msg, stringID: "music_proTipDesc", values: { command1: "`ougi music`", command2: "`ougi " + links[Math.floor(Math.random()*links.length)] + "`" } })})
  .addFields({name: await ougi.text({ msg, stringID: "music_createQueueField" }), value: await ougi.text({ msg, stringID: "music_createQueueDesc" })})
  .addFields({name: await ougi.text({ msg, stringID: "music_skipField" }), value: "`ougi music skip`"})
  .addFields({name: await ougi.text({ msg, stringID: "music_removeField" }), value: "`ougi music remove " + Math.floor(Math.random()*videos.length++) + "`"})
  .addFields({name: await ougi.text({ msg, stringID: "music_previewQueueField" }), value: await ougi.text({ msg, stringID: "music_previewQueueDesc", values: { command1: "`ougi music list`", command2: "`ougi music queue`", command3: "`ougi music playlist`" } })})
  .addFields({name: await ougi.text({ msg, stringID: "music_stopField" }), value: "`ougi music stop`"})
  .addFields({name: await ougi.text({ msg, stringID: "music_loopField" }), value: "`ougi music loop`"})
  .addFields({name: await ougi.text({ msg, stringID: "music_unloopField" }), value: "`ougi music unloop`"})
  .addFields({name: await ougi.text({ msg, stringID: "music_aliasesField" }), value: await ougi.text({ msg, stringID: "music_aliasesDesc", values: { alias1: "`ougi play`", alias2: "`ougi p`" } })});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
