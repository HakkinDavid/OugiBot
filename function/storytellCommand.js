const { EmbedBuilder } = require('discord.js');

const activeSessions = {};

module.exports = async function storytellCommand(args, msg) {
  if (!msg.guild) {
    msg.channel.send(await ougi.text(msg, "mustGuild")).catch(console.error);
    return;
  }

  const channelId = msg.channel.id;

  if (activeSessions[channelId]) {
    msg.channel.send("A storytelling session is already active in this channel! Type your response to participate.").catch(console.error);
    return;
  }

  ougi.economy('init', msg);

  const scenarios = [
    "You and your companions discover a mysterious glowing chest inside an abandoned monogatari shrine...",
    "Ougi appears out of thin air with a spooky riddle that holds the secret to endless wealth or eternal damnation...",
    "A strange portal opens in the middle of the server, smelling of fresh pancakes and dark magic...",
    "You stumble upon a hidden underground casino run by shadowy spirits offering a single high-stakes game..."
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
    .setTitle("📖 Interactive Storytelling RPG Session!")
    .setDescription(`**Scenario:**\n*"${scenario}"*\n\n**Instructions:**\nEach participant gets **1 turn** to type a sentence continuing the story. You have **1 minute** between responses before Ougi judges your collective fate! Have a heads up with **5 minutes since this message was sent**.`)
    .setColor("#9B59B6")
    .setFooter({ text: "Type your story turn directly into this channel!", iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) })
    .setTimestamp();

  await msg.channel.send({ embeds: [startEmbed] });

  const filter = m => !m.author.bot && m.content.length > 0 && !ougi.helperFunctions.checkForPrefix(m);
  const collector = msg.channel.createMessageCollector({ filter, time: 5 * 60 * 1000 });

  collector.on('collect', m => {
    if (session.participants.has(m.author.id)) {
      m.reply("You have already taken your turn in this story session!").catch(console.error);
      return;
    }

    session.participants.add(m.author.id);
    session.turns.push({ author: m.author.username, id: m.author.id, text: m.content });
    m.react('📝').catch(() => {});

    // Reset 5-minute timer for next turn
    collector.resetTimer({ time: 1 * 60 * 1000 });
  });

    collector.on('end', async () => {
    delete activeSessions[channelId];

    if (session.turns.length === 0) {
      msg.channel.send("The storytelling session expired with no participants.").catch(console.error);
      return;
    }

    const storyText = session.turns.map(t => `${t.author}: "${t.text}"`).join("\n");
    const aiPrompt = [
      { role: 'system', content: "You are Oshino Ougi, judging an interactive story RPG session. Decide if the outcome is a GLORIOUS REWARD or a DAMNED PENALTY. End your response with REWARD: <amount> or PENALTY: <amount>." },
      { role: 'user', content: `Scenario: ${scenario}\n\nUser Turns:\n${storyText}` }
    ];

    let aiResult = "";
    try {
      aiResult = await ougi.genAIText(aiPrompt);
    } catch { }

    if (!aiResult || typeof aiResult !== 'string') {
      aiResult = "Ougi judged your adventure! Outcome: Glorious Reward! REWARD: 200";
    }

    const isReward = !aiResult.toLowerCase().includes("penalty");
    const rewardAmount = isReward ? 200 : 100;
    const db = ougi.db();
    const guildEco = db.getGuildEconomy(msg.guildId);
    const currencySymbol = guildEco.currency;

    for (const userId of session.participants) {
      const user = db.getUser(msg.guildId, userId);
      if (isReward) {
        user.money = (user.money || 0) + rewardAmount;
      } else {
        user.money = Math.max(0, (user.money || 0) - rewardAmount);
      }
      db.saveUser(msg.guildId, userId, user);
    }

    const endEmbed = new EmbedBuilder()
      .setTitle("🎭 Storytelling Session Concluded!")
      .setDescription(`**Conclusion:**\n${aiResult.slice(0, 1500)}\n\n${isReward ? `🎉 All participants earned **+${rewardAmount} ${currencySymbol}**!` : `💀 All participants lost **-${rewardAmount} ${currencySymbol}**!`}`)
      .setColor(isReward ? "#00FF00" : "#FF0000")
      .setFooter({ text: `Participants: ${session.participants.size}`, iconURL: msg.client.user.avatarURL({ dynamic: true, size: 4096 }) })
      .setTimestamp();

    await msg.channel.send({ embeds: [endEmbed] });
  });
};
