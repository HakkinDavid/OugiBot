module.exports =

async function (msg) {
  var videos = ["angels on my side", "every one of us", "never gonna give you up", "chocolate insomnia midi by hakkindavid", "07734 midi by hakkindavid"];
  var links = ["https://www.youtube.com/watch?v=Q2yderDJKJA", "https://www.youtube.com/watch?v=MsHk2Z41riE", "https://www.youtube.com/watch?v=7qZugJCf2eI", "https://www.youtube.com/watch?v=HPOKr-Wyscw", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"];
  var embed = await ougi.helpPreset(msg, "music");
  var proTipTemplate = await ougi.text(msg, "music_proTipDesc");
  embed.setDescription(await ougi.text(msg, "musicHelpDesc"))
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi music " + videos[Math.floor(Math.random()*videos.length)] + "`"})
  .addFields({name: await ougi.text(msg, "music_proTipField"), value: proTipTemplate.replace(/{link}/g, links[Math.floor(Math.random()*links.length)])})
  .addFields({name: await ougi.text(msg, "music_createQueueField"), value: await ougi.text(msg, "music_createQueueDesc")})
  .addFields({name: await ougi.text(msg, "music_skipField"), value: "`ougi music skip`"})
  .addFields({name: await ougi.text(msg, "music_removeField"), value: "`ougi music remove " + Math.floor(Math.random()*videos.length++) + "`"})
  .addFields({name: await ougi.text(msg, "music_previewQueueField"), value: await ougi.text(msg, "music_previewQueueDesc")})
  .addFields({name: await ougi.text(msg, "music_stopField"), value: "`ougi music stop`"})
  .addFields({name: await ougi.text(msg, "music_loopField"), value: "`ougi music loop`"})
  .addFields({name: await ougi.text(msg, "music_unloopField"), value: "`ougi music unloop`"})
  .addFields({name: await ougi.text(msg, "music_aliasesField"), value: await ougi.text(msg, "music_aliasesDesc")});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
