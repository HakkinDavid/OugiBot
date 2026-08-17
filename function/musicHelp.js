module.exports = async function (msg) {
  var videos = ["angels on my side", "every one of us", "never gonna give you up", "chocolate insomnia midi by hakkindavid", "07734 midi by hakkindavid"];
  var links = ["https://www.youtube.com/watch?v=Q2yderDJKJA", "https://www.youtube.com/watch?v=MsHk2Z41riE", "https://www.youtube.com/watch?v=7qZugJCf2eI", "https://www.youtube.com/watch?v=HPOKr-Wyscw", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"];
  var embed = await ougi.helpPreset(msg, "music");
  embed.setDescription(await ougi.text({ msg, stringID: "musicHelpDesc" }))
  .addFields({name: await ougi.text({ msg, stringID: "example" }), value: "`ougi music " + videos[Math.floor(Math.random()*videos.length)] + "`"})
  .addFields({name: await ougi.text({ msg, stringID: "music_proTipField" }), value: await ougi.text({ msg, stringID: "music_proTipDesc", values: { command1: "`ougi music`", command2: "`ougi " + links[Math.floor(Math.random()*links.length)] + "`" } })})
  .addFields({name: await ougi.text({ msg, stringID: "music_createQueueField" }), value: await ougi.text({ msg, stringID: "music_createQueueDesc" })})
  .addFields({name: await ougi.text({ msg, stringID: "music_pauseField" }), value: "`ougi music pause` (or `ougi pause`)"})
  .addFields({name: await ougi.text({ msg, stringID: "music_resumeField" }), value: "`ougi music resume` (or `ougi resume`)"})
  .addFields({name: await ougi.text({ msg, stringID: "music_nowPlayingField" }), value: "`ougi music np` (or `ougi np`)"})
  .addFields({name: await ougi.text({ msg, stringID: "music_skipField" }), value: "`ougi music skip` (or `ougi skip`)"})
  .addFields({name: await ougi.text({ msg, stringID: "music_removeField" }), value: "`ougi music remove 2` or `ougi music remove <title>` (or `ougi remove <query>`)"})
  .addFields({name: await ougi.text({ msg, stringID: "music_previewQueueField" }), value: "`ougi music queue` (or `ougi queue`)"})
  .addFields({name: await ougi.text({ msg, stringID: "music_radioField" }), value: "`ougi music radio` (or `ougi radio`)"})
  .addFields({name: await ougi.text({ msg, stringID: "music_loopField" }), value: "`ougi music loop`"})
  .addFields({name: await ougi.text({ msg, stringID: "music_unloopField" }), value: "`ougi music unloop`"})
  .addFields({name: await ougi.text({ msg, stringID: "music_stopField" }), value: "`ougi music stop` (or `ougi stop`)"})
  .addFields({name: await ougi.text({ msg, stringID: "music_aliasesField" }), value: await ougi.text({ msg, stringID: "music_aliasesDesc", values: { alias1: "`ougi play`", alias2: "`ougi p`" } })});

  msg.channel.send({embeds: [embed]}).catch(console.error);
};
