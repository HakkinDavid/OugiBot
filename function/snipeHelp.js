module.exports =

async function (msg, isEdit) {
  let command = 'snipe';
  if (isEdit) {
    command = 'editsnipe';
  }
  let phrases = ["i love dogs", "where are you bb?", "is this sending?"];
  let sniped = phrases[Math.floor(Math.random()*phrases.length)];
  let phrasesTwo = ["i love cats", "don't flirt with me, you- baka", "i hate cheese"];
  let snipedTwice = phrasesTwo[Math.floor(Math.random()*phrasesTwo.length)];
  let embed = await ougi.helpPreset(msg, command);
  embed.setDescription(await ougi.text(msg, command + "HelpDesc"))
  .addFields({name: await ougi.text(msg, "example"), value: "`ougi " + command + "`"})
  .addFields({name: await ougi.text(msg, "output"), value: "<:ougi:730355760864952401> **Ougi said** <:quote:730061725755375667> " + sniped})
  .addFields({name: "Example 2", value: "`ougi " + command + " 3`"})
  .addFields({name: await ougi.text(msg, "output"), value: "<:ougi:730355760864952401> **Ougi said** <:quote:730061725755375667> " + snipedTwice});

  msg.channel.send({embeds: [embed]}).catch(console.error);
}
