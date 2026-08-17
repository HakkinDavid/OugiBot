module.exports = async function (msg) {
  if (msg.author.id == davidUserID) {
    let rawSlices = msg.content.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim().split(" ");
    let hauntedCommand = rawSlices[1]?.toLowerCase();
    let args = rawSlices.slice(2);

    let embed = new Discord.EmbedBuilder()
      .setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL({ dynamic: true, size: 4096 }) })
      .setDescription("ID `" + msg.author.id + "`")
      .setColor("#FF008C")
      .setFooter({ text: await ougi.text({ lang: 'en', stringID: "log_globalEmbedFooter" }) || "Global Log", iconURL: client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
      .setTimestamp();

    if (hauntedCommand == undefined) {
      embed.addFields({ name: await ougi.text({ lang: 'en', stringID: "root_noTrigger" }) || "No Command", value: "\u200B" });
    } else {
      embed.addFields({ name: await ougi.text({ lang: 'en', stringID: "root_commandField" }) || "Command", value: hauntedCommand });
    }

    const argsString = args.join(" ");
    if (argsString.length > 0) {
      const argsFieldName = await ougi.text({ lang: 'en', stringID: "root_argumentsField" }) || "Arguments";
      if (argsString.length <= 1024) {
        embed.addFields({ name: argsFieldName, value: argsString });
      } else {
        embed.addFields({ name: argsFieldName, value: argsString.slice(0, 1024) });
        embed.addFields({ name: "\u200B", value: argsString.slice(1024, 2048) });
      }
    }

    const logCh = client.channels.cache.get(consoleLogging) ?? await client.channels.fetch(consoleLogging).catch(() => null);
    if (logCh) logCh.send({ embeds: [embed] }).catch(console.error);

    switch (hauntedCommand) {
      case "help":
        await ougi.helpRootCommand(args, msg);
        break;
      case "status":
        await ougi.statusRootCommand(msg);
        break;
      case "log":
        await ougi.logRootCommand(args, msg);
        break;
      case "shutdown":
        await ougi.vibeCheckReallyHard(msg);
        break;
      case "notifysurvey":
        await ougi.notifySurvey(msg);
        break;
      case "haunt":
        await ougi.hauntRootCommand(args, msg);
        break;
      case "newsletter":
        await ougi.newsletter(msg);
        break;
      case "switch":
        await ougi.switchy(args, msg);
        break;
      case "survey":
        await ougi.createSurvey(msg);
        break;
      case "ban":
        await ougi.banCommand(msg);
        break;
      case "patron":
        await ougi.patronCommand(msg);
        break;
      case "inspect":
        await ougi.inspectCommand(msg);
        break;
      case "raffle-license":
        if (ougi.raffleLicenseCommand) {
          await ougi.raffleLicenseCommand(msg);
        } else {
          await require('./raffleLicenseCommand')(msg);
        }
        break;
      default:
        await ougi.undefinedCommand(args, msg);
        break;
    }
  } else {
    let options = [
      "Ara ara! Only David-senpai is allowed to access my root commands",
      "N-nani? Stop it, my senpai. What are you doing?",
      "Nani? Nani? Nani? What's going on? Why is my senpai calling me out, using my root commands prefix and trying to peek at them?"
    ];
    let response = options[Math.floor(Math.random() * options.length)];
    msg.channel.send(response).catch(console.error);
    return;
  }
};
