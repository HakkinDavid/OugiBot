module.exports =

  async function (msg) {
    let num = Math.floor(Math.random() * 6) + 1;
    let embed = await ougi.helpPreset(msg, "dice");
    embed.setDescription(await ougi.text({ msg, stringID: "diceHelpDesc" }))
      .addFields({ name: await ougi.text({ msg, stringID: "example" }), value: "`ougi dice`" })
      .addFields({ name: await ougi.text({ msg, stringID: "output" }), value: await ougi.text({ msg, stringID: "diceTitle", values: { num } }) })
      .setImage('https://github.com/HakkinDavid/OugiBot/blob/master/images/dice/' + num + '.png?raw=true');

    msg.channel.send({ embeds: [embed] }).catch(console.error);
  }
