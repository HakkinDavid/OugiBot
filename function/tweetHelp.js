module.exports =

async function (msg) {
  var phrases = ["i like fortnite", "foo", "we are no strangers to love"];
  var embed = await ougi.helpPreset(msg, "tweet");
  embed.setDescription(await ougi.text(msg, "tweetHelpDesc"))
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi tweet `" + msg.author.toString() + "` " + phrases[Math.floor(Math.random()*phrases.length)] + "`"});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
