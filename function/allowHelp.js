module.exports =

  async function (msg) {
    let embed = await ougi.helpPreset(msg, "allow");
    if (!(await ougi.guildCheck(msg))) return;
    let phrases = ["sike", "say a bad word", "snipe"];
    let allow = phrases[Math.floor(Math.random() * phrases.length)];
    let chosenKey = ["reactingTo", "alrightWhitelisted"][Math.floor(Math.random() * 2)];
    let answer = await ougi.text({
      msg,
      stringID: chosenKey,
      values: {
        triggerName: "`" + allow + "`",
        guildName: msg.guild.toString()
      }
    });
    embed.setDescription(await ougi.text({ msg, stringID: "allowUsage" }))
      .addFields({ name: await ougi.text({ msg, stringID: "specialPermission" }), value: ":warning: " + await ougi.text({ msg, stringID: "onlyOwner" }) })
      .addFields({ name: await ougi.text({ msg, stringID: "example" }), value: "`ougi allow " + allow + "`" })
      .addFields({ name: await ougi.text({ msg, stringID: "output" }), value: answer });

    msg.channel.send({ embeds: [embed] }).catch(console.error);
  }
