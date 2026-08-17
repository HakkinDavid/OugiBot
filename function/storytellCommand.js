const { EmbedBuilder } = require('discord.js');

const activeSessions = {};

module.exports = async function storytellCommand(args, msg) {
  if (!msg.guild) {
    msg.channel.send(await ougi.text({ msg, stringID: "mustGuild" })).catch(console.error);
    return;
  }

  const channelId = msg.channel.id;

  if (activeSessions[channelId]) {
    msg.channel.send(await ougi.text({ msg, stringID: "storytell_alreadyActive" })).catch(console.error);
    return;
  }

  ougi.economy('init', msg);

  const scenarios = [
    await ougi.text({ msg, stringID: "ai_storytellerScenario1" }),
    await ougi.text({ msg, stringID: "ai_storytellerScenario2" }),
    await ougi.text({ msg, stringID: "ai_storytellerScenario3" }),
    await ougi.text({ msg, stringID: "ai_storytellerScenario4" })
  ];

  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

  const session = {
    host: msg.author.id,
    scenario,
    turns: [],
    participants: new Set(),
    timer: null,
    ended: false
  };

  activeSessions[channelId] = session;

  const startEmbed = new EmbedBuilder()
    .setTitle(await ougi.text({ msg, stringID: "storytell_startTitle" }))
    .setDescription(await ougi.text({ msg, stringID: "storytell_startDesc", values: { scenario } }))
    .setColor("#9B59B6")
    .setFooter({ text: await ougi.text({ msg, stringID: "storytell_startFooter" }), iconURL: msg.client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
    .setTimestamp();

  await msg.channel.send({ embeds: [startEmbed] });

  const filter = m => !m.author.bot && m.content.length > 0 && !ougi.helperFunctions.checkForPrefixMsg(m);
  const collector = msg.channel.createMessageCollector({ filter, time: 5 * 60 * 1000 });

  collector.on('collect', async m => {
    if (session.participants.has(m.author.id)) {
      m.reply(await ougi.text({ msg, stringID: "storytell_alreadyTakenTurn" })).catch(console.error);
      return;
    }

    session.participants.add(m.author.id);
    session.turns.push({ author: m.author.username, id: m.author.id, text: m.content });
    m.react('📝').catch(() => {});

    // Reset 1-minute timer for next turn
    collector.resetTimer({ time: 1 * 60 * 1000 });
  });

  collector.on('end', async () => {
    delete activeSessions[channelId];

    if (session.turns.length === 0) {
      msg.channel.send(await ougi.text({ msg, stringID: "storytell_expiredNoParticipants" })).catch(console.error);
      return;
    }

    const storyText = session.turns.map(t => `${t.author}: "${t.text}"`).join("\n");
    const systemPromptContent = await ougi.text({ lang: 'en', stringID: "ai_storytellerSystemPrompt" });
    const aiPrompt = [
      { role: 'system', content: systemPromptContent },
      { role: 'user', content: `Scenario: ${scenario}\n\nUser Turns:\n${storyText}` }
    ];

    let aiResult = "";
    try {
      aiResult = await ougi.genAIText(aiPrompt);
    } catch { }

    if (!aiResult || typeof aiResult !== 'string') {
      aiResult = await ougi.text({ msg, stringID: "ai_storytellerFallbackJudge" });
    }

    const isReward = !aiResult.toLowerCase().includes("penalty");
    const rewardAmount = isReward ? 200 : -100;
    const db = ougi.db();
    const guildEco = db.getGuildEconomy(msg.guildId);
    const currencySymbol = guildEco.currency;

    for (const userId of session.participants) {
      db.adjustMoney(msg.guildId, userId, rewardAmount);
    }

    const outcomeNotice = isReward
      ? await ougi.text({ msg, stringID: "storytell_rewardAll", values: { amount: 200, currency: currencySymbol } })
      : await ougi.text({ msg, stringID: "storytell_penaltyAll", values: { amount: 100, currency: currencySymbol } });

    const endEmbed = new EmbedBuilder()
      .setTitle(await ougi.text({ msg, stringID: "storytell_concludedTitle" }))
      .setDescription(`**Conclusion:**\n${aiResult.slice(0, 1500)}\n\n${outcomeNotice}`)
      .setColor(isReward ? "#00FF00" : "#FF0000")
      .setFooter({ text: await ougi.text({ msg, stringID: "storytell_participantsFooter", values: { count: session.participants.size } }), iconURL: msg.client.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
      .setTimestamp();

    await msg.channel.send({ embeds: [endEmbed] }).catch(console.error);
  });
};
