module.exports =

async function (msg) {
  let embed = await ougi.helpPreset(msg, "healthcare");
  embed.setDescription((await ougi.text(msg, "healthcareDesc")))
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi healthcare`"});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
