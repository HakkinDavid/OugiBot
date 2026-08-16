module.exports =

  async function (arguments, msg) {
    if (!(await ougi.guildCheck(msg))) return;

    
    if (!(await ougi.adminCheck(msg))) return;

    if (arguments.length <= 0) {
      msg.channel.send(await ougi.text({ msg, stringID: "oneCharWhitelist" }));
      return
    }

    let trigger = arguments.join(" ");

    if (msg.content.includes("@everyone") || msg.content.includes("@here")) {
      msg.channel.send(await ougi.text({ msg, stringID: "massivePing" }));
      return
    }

    if (trigger.includes("<@") && trigger.includes(">")) {
      msg.channel.send(await ougi.text({ msg, stringID: "avoidSpecialChar" })).catch(console.error);
      return
    }

    while (trigger.endsWith(" ")) {
      trigger = trigger.substring(0, trigger.length - 1)
    }

    while (trigger.startsWith(" ")) {
      trigger = trigger.substring(1, trigger.length)
    }

    if (trigger.length <= 0) {
      msg.channel.send(await ougi.text({ msg, stringID: "oneCharWhitelist" }));
      return
    }

    let chosenKey = ["reactingTo", "alrightWhitelisted"][Math.floor(Math.random() * 2)];
    let answer = await ougi.text({
      msg,
      stringID: chosenKey,
      values: {
        triggerName: "`" + trigger + "`",
        guildName: msg.guild.toString()
      }
    });

    const unblacklisted = ougi.db().unblacklistTrigger(msg.guildId, trigger);
    if (unblacklisted) {
      client.channels.cache.get(consoleLogging).send("Trigger to be removed from blacklist: `" + trigger + "` in `" + msg.guild.toString() + "` with msg.guildId `" + msg.guildId + "`");
      msg.channel.send(answer).catch(console.error);
      return;
    }
    msg.channel.send(await ougi.text({ msg, stringID: "notBlacklisted" }));
    return;
  }
