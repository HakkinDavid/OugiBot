module.exports =

async function (msg, replied_to_ougi) {
  while (msg.content.includes('  ')) {
    msg.content = msg.content.replace('  ', ' ')
  }
  while (msg.content.includes('\n\n')) {
    msg.content = msg.content.replace('\n\n', '\n')
  }
  while (msg.content.includes('\n')) {
    msg.content = msg.content.replace('\n', ' ')
  }

  msg.content = msg.content.replace('<@629837958123356172>', 'ougi').replace('扇', 'ougi').replace('<@!629837958123356172>', 'ougi');

  // Uso de interactions[msg.channel.id] en vez de previous_messages
  if (!interactions[msg.channel.id]) interactions[msg.channel.id] = [];
  let channelInteractions = interactions[msg.channel.id];

  let context = "";
  if (msg.channel.type === Discord.ChannelType.GuildText) {
    context = (await ougi.text(msg, "contextTextChannel")).replace(/{guildName}/, msg.guild.toString()).replace(/{channelName}/, msg.channel.name);
  } else {
    context = (await ougi.text(msg, "contextDM"));
  }

  //let user_context = settingsOBJ.AI.description[msg.author.id];
  let userMessage = "[" + msg.author.username + "]:\n" + msg.content;
  let spookyReply = null;

  // Construir mensajes para el modelo
  let aiMessages = [
    { role: 'system', content: (await ougi.text(msg, "whoAmI")) },
    { role: 'system', content: (await ougi.text(msg, "instructions")) },
    //{ role: 'system', content: (await ougi.text(msg, "userIsNamed")).replace(/{userName}/, msg.author.username) + (user_context ? "\n" + user_context : "") },
    { role: 'system', content: context },
    { role: 'assistant', content: (await ougi.text(msg, "introductionAI")) },
    ...channelInteractions,
    { role: 'user', content: userMessage }
  ];

  try {
    await msg.channel.sendTyping().catch(console.error);
    spookyReply = await ougi.genAIText(aiMessages);
  }
  catch (e) {
    spookyReply = null;
    console.error(e);
  }

  if (typeof spookyReply !== "string" || spookyReply.includes("OpenAI")) { ougi.judgementAbility(msg, replied_to_ougi); return; }

  spookyReply = await ougi.text(msg, spookyReply, true);

  // Actualizar el historial de interacciones del canal
  channelInteractions.push({ role: "user", content: userMessage });
  channelInteractions.push({ role: "assistant", content: spookyReply });
  // Mantener solo los últimos 5 mensajes
  if (channelInteractions.length > 5) {
    // Mantener los últimos 5 (eliminar los más antiguos)
    interactions[msg.channel.id] = channelInteractions.slice(-5);
  }

  let embed = new Discord.EmbedBuilder()
    .setTitle("Input for genAIAbility (" + msg.channel.type + " type channel)")
    .setAuthor({ name: msg.author.username, icon: msg.author.avatarURL({ dynamic: true, size: 4096 }) })
    .setColor("#FF008C")
    .setFooter({ text: "globalLogEmbed by Ougi", icon: client.user.avatarURL({ dynamic: true, size: 4096 }) })
    .addFields({ name: "Content", value: msg.content.slice(0, 1024) })
    .addFields({ name: "Reply", value: spookyReply });

  msg.reply(spookyReply).catch(console.error);
  client.channels.cache.get(consoleLogging).send({ embeds: [embed] });

  /*
  try {
    let updated_user_context = await ougi.genAIText(
      [
        { role: 'system', content: (await ougi.text(msg, "whoAmI")) },
        { role: 'system', content: (await ougi.text(msg, "userIsNamed")).replace(/{userName}/, msg.author.username) + (user_context ? "\n" + user_context : "") },
        ...channelInteractions,
        { role: 'user', content: msg.content },
        { role: 'system', content: (await ougi.text(msg, "userDescription")) }
      ]
    );

    settingsOBJ.AI.description[msg.author.id] = updated_user_context;
    await ougi.writeFile(database.settings.file, JSON.stringify(settingsOBJ, null, 4), console.error);
    await ougi.backup(database.settings.file, channels.settings);
  }
  catch (e) {
    console.error(e);
  }
  */
}
